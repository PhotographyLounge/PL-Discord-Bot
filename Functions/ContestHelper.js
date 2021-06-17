const GerneralFunctions = require('./GeneralFunctions.js');
const Discord = require('discord.js');
const fs = require('fs');

async function Helper(client, message, config)
{
	if(message.member.roles.cache.has(config.Contest.HelpRole) || message.member.roles.cache.has(config.Contest.OwnRole))
	{
		
		if(message.content.includes("sub start"))
		{
			await SubStart(client, message, config)
			message.delete()
		}

		else if(message.content.includes("sub vote"))
		{
			await SubVote(client, message, config)
			message.delete()
		}
		else if(message.content.includes("sub results"))
		{
			await GetResults(message, client, config)
			message.delete()
		}
		else if(message.content.includes("sub prize"))
		{
			await GivePrize(client, message, config)
			//message.delete()
		}

		GerneralFunctions.LogToSIEM({"Module":"Contesthelper", "Function":"Administrative  Commands", "Username":message.author.username, "Content":message.content})
	}
}


async function SubStart(client, message, config)
{
	const guild     = client.guilds  .cache.get(config.Contest.Guild)
	const channel   = guild .channels.cache.get(config.Contest.Channel)

	const roles     = message.guild.roles;
    const everybody = roles.cache.find(r => r.id === config.Contest.EverRole);
	
    var start = null

	await channel.overwritePermissions([{id:everybody, allow:['SEND_MESSAGES'],},], 'Submission Phase')
	await channel.send("----- SUBMISSIONS BELOW ------").then(msg => {start = msg.id})
	await fs.writeFile(config.Contest.SubFile, '{"subs":{},"start":"'+ start + '"}\n', (err) => {if (err) throw err;})
}

async function AddSub(client, message, config)
{
	if(message.attachments.size === 1)
	{
		let rawdata = fs.readFileSync(config.Contest.SubFile);
		let data    = JSON.parse(rawdata);

		// Check Resub
		if(data.subs[message.author.id] == null)
		{

			data.subs[message.author.id] = message.id;			

			let jsonstring = JSON.stringify(data);
			fs.writeFile(config.Contest.SubFile, jsonstring, (err) => {if (err) throw err;});


			console.log("Added Submission:" + message.id)
		}
		else
		{
			message.channel.send("You have already entered a Submission. Please remove your submission before you enter a new one.").then(msg => {msg.delete({timeout:5000})});
			message.delete();
		}
	}
	else if (message.attachments.size > 1)
	{
		message.delete();
		id = message.reply("Sending multiple attachments is prohibited").then(msg => {msg.delete({timeout:5000})});				
	}
	else if (message.attachments.size < 1)
	{
		message.delete();
		id = message.reply("Sending text in this chat is prohibited").then(msg => {msg.delete({timeout:5000})});				
	}

	GerneralFunctions.LogToSIEM({"Module":"Contesthelper", "Function":"Add Submission", "Username":message.author.username, "Content":message.id})
	return;
}

async function RemSub(client, message, config)
{
	let rawdata = fs.readFileSync(config.Contest.SubFile);
	let data    = JSON.parse(rawdata);

	if(data.subs[message.author.id] == message.id)
	{
		delete data.subs[message.author.id];			

		let jsonstring = JSON.stringify(data);
		fs.writeFile(config.Contest.SubFile, jsonstring, (err) => {if (err) throw err;});
	
		console.log("Removed Submission:" + message.id)
	}

	GerneralFunctions.LogToSIEM({"Module":"Contesthelper", "Function":"Remove Submission", "Username":message.author.username, "Content":message.id})
}

async function SubVote(client, message, config)
{
	const guild     = client.guilds  .cache.get(config.Contest.Guild)
	const channel   = guild .channels.cache.get(config.Contest.Channel)

	const roles     = message.guild.roles;
    const everybody = roles.cache.find(r => r.id === config.Contest.EverRole);

	await channel.send("----- VOTE ABOVE -----")
	
	let rawdata = fs.readFileSync(config.Contest.SubFile);
	let data    = JSON.parse(rawdata);

	console.log(data)
	for (var key in data.subs) {
			AddVoteReact(client ,message, data.subs[key], channel, config)
	}


	await channel.send("You can start scrolling down from this submission : ")

	const oldmsg = channel.messages.fetch(data.start)
	oldmsg.then(msg => channel.send(msg.url))

	await channel.overwritePermissions([{id:everybody, deny:['SEND_MESSAGES'],},], 'Submission Phase')		
}

function AddVoteReact(client ,message, element, channel, config)
{
	message = channel.messages.fetch(element).then( messages => messages.react(config.Contest.Emoji))
}

function LoadSubmissions(client, config)
{
	const guild     = client.guilds  .cache.get(config.Contest.Guild)
	const channel   = guild .channels.cache.get(config.Contest.Channel)

	let rawdata = fs.readFileSync(config.Contest.SubFile);
	let data    = JSON.parse(rawdata);

	for (var key in data.subs) 
	{
		channel.messages.fetch(data.subs[key])
	} 
}

async function GetResults(message, client, config)
{
	console.log("Starting Results")

	const guild     = client.guilds  .cache.get(config.Contest.Guild)
	const channel   = guild .channels.cache.get(config.Contest.Channel)

	let rawdata = fs.readFileSync(config.Contest.SubFile);
	let data    = JSON.parse(rawdata);


	var list = [];

	for (var key in data.subs) 
	{
		await channel.messages.fetch(data.subs[key]).then( message => {list.push([message.reactions.cache.get(config.Contest.Emoji),message]);})
	}

	if(list.length != 0)	
	{
		list.sort(function(a, b) {
	  		var keyA = a[0].count, keyB = b[0].count;
	  		if (keyA > keyB) return -1;
	  		if (keyA < keyB) return 1;
	  		return 0;});

		for (var cnt in list) 
		{
			var msg = channel.messages.fetch(list[cnt].message)
			fs.appendFile(config.Contest.WinFile, list[cnt][0].count + " Votes:" + list[cnt][1].author.username + "\n", (err) => {if (err) throw err;});
		}

		await message.channel.send("", { files: [config.Contest.WinFile] })
		await fs.writeFile(config.Contest.WinFile, '', (err) => {if (err) throw err;}) 
	}
}


async function GivePrize(client, message, config)
{
	const guild = client.guilds.cache.get(config.Contest.Guild)

	let users = message.content.split("prize ")
	users     = users[1].split(" ")

	var role = [config.Contest.stRole, config.Contest.ndRole, config.Contest.rdRole, config.Contest.JPRole];
	if(users.length < 5)
	{
		for (var elem in users)
		{
			users[elem] = users[elem].replace("<@!", "");
			users[elem] = users[elem].replace(">", "");
		
			// find memeber statement
			await guild.members.fetch(users[elem]).then( mem => {


				if(mem.roles.cache.has(role[elem]))
				{
					var place = parseInt(elem) + 1
					if(elem != 3){message.channel.send("Member <@!" + users[elem] + "> has already the " + place + " Place role").then(msg => {msg.delete({timeout:5000})})}
					else{message.channel.send("Member <@!" + users[elem]  + "> has already the Jury Pick Role").then(msg => {msg.delete({timeout:5000})})}
				}
				else
				{
					var place = parseInt(elem) + 1
					mem.roles.add(role[elem])
					if(elem != 3){message.channel.send("Gave Member <@!" + users[elem] + "> the " + place + " Place role").then(msg => {msg.delete({timeout:5000})})}
					else{message.channel.send("Gave Member <@!" + users[elem]  + "> the Jury Pick Role").then(msg => {msg.delete({timeout:5000})})}
				}
			}).catch(console.error);
			
		}
	}
	else
	{
		message.channel.send("Invalid input make sure the Syntax is right").then(msg => {msg.delete({timeout:5000})})
	}
}



module.exports.Helper = Helper;
module.exports.AddSub = AddSub;
module.exports.RemSub = RemSub;
module.exports.LoadSubmissions = LoadSubmissions;

