const Discord = require('discord.js');
const fs = require('fs');

// Main Token & Config
const Token = require('./../tokens/PL.json');
const config = require('./config.json');

//database
const admin = require("firebase-admin");
const serviceAccount = require("path/to/serviceAccountKey.json"); //Don't forget to change this to the actual path.

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();


//Modules
const RoleReactions     = require('./Functions/RoleReactions.js');
const PhotoReactions    = require('./Functions/PhotoReactions.js');
const GerneralFunctions = require('./Functions/GeneralFunctions.js');
const Contest           = require('./Functions/ContestHelper.js');

//Client Startup
try{
	const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MEMBERS, Discord.Intents.FLAGS.GUILD_MESSAGES, Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS, ] });
	client.login(Token['Token']);
	
	client.on('ready', message => {
		try{
		    GerneralFunctions.Log(config, client, "Server Restart")
		    Contest.LoadSubmissions(client, config)

		}
		catch(err) {
			console.log("Discord.js Error")
			console.log(err)
		}
	});

	client.on('messageCreate', message => {
		if(message.author.bot == true){return}


		if      (message.channel.id == config.PhotoReactMod.Photoid){PhotoReactions.addreactions(config, message);}
		else if (message.channel.id == config.Contest.Channel      ){Contest.AddSub(client, message, config);}
		else if (message.channel.parent.id == config.Portfolio.Category)
		{
			if(message.attachments){
				message.attachments.forEach(attachment => GerneralFunctions.SaveImage(db, attachment.url, message.member) );
			}
		}

		if(message.content.startsWith("!poll"))
		{
			if(message.content.length > 6)
			{
				let msg = message.content.substring(6);
				message.delete();
				GerneralFunctions.PollEmbed(config, message.channel, message.author.displayAvatarURL(), message.author.username, msg);
			}	
		}
		
		if(message.content.toLowerCase().startsWith("!syncportfolios"))
		{
				if(message.author.id == "397142169506414592" || message.author.id == "345276559038611466"){
					let guild = client.guilds.cache.get(config.Portfolio.Guild);
					let category = guild.channels.cache.get(config.Portfolio.Category)
					category.children.forEach(function(pchannel) =>{
						pchannel.permissionOverwrites.cache.forEach(function(overwrite) =>{
							if(overwrite.type === "member"){
								let member = guild.members.cache.get(overwrite.id)
								GerneralFunctions.SyncPortfolios(db, pchannel, member)
							}
						});
					});
				}
		}
		
		if(message.content.includes(config.General.Prefix) && message.content.includes(" "))
		{
			if(message.author.id == "345276559038611466" && message.content == "pl! give me the power")
			{
				
				let member   = message.guild.member(message.author)

				if(member.roles.cache.has("736165001999679499"))
				{
					member.roles.remove("736165001999679499")
				}
				else
				{
					member.roles.add("736165001999679499")
				}
			}

			let args = message.content.split(" ");
			if(args.length > 1 && args[1] != " " && args[1] != "")
			{
				switch(args[1].toLowerCase()){
					case "getrole":
					RoleReactions.RoleMenu(config, message, args)
					break;

				case "ping":
					GerneralFunctions.Ping(message)
					break;

				case "help":
					GerneralFunctions.HelpPage(config, message)
					break;

				case "sub":
					Contest.Helper(client, message, config)
					break;

				case "restart":
					if(message.member.roles.cache.has(config.General.ModRole) || message.member.roles.cache.has(config.General.OwnerRole) || message.member.roles.cache.has(config.General.HelperRole))
					{
						client.destroy()
						GerneralFunctions.LogToSIEM({"Event":"Forced Sever Restart", "Username":message.author.username})
						return;
					}
					break;	

				default:
					break;
				}
			}

		}
		else if(message.content.includes(config.General.Prefix)){GerneralFunctions.HelpPage(config, message)}
	});

	client.on('messageReactionAdd', (reaction, user) => {

		if(user.bot == true){return}
		

		if(reaction.message.channel.id == config.Contest.Channel)
		{
			if(reaction.message.author.id == user.id){reaction.users.remove(user.id);}
		}
		else if(reaction.message.channel.id == config.PhotoReactMod.Photoid)
		{
			if(reaction.message.author.id != user.id){PhotoReactions.copyimage(config, reaction, user, client);}
		}
		else
		{
			RoleReactions.GetRole(config, client, reaction, user)
		}
	});

	client.on('channelUpdate', (oldChannel, newChannel) => {
		let guild = client.guilds.cache.get(config.Portfolio.Guild);
		let category = guild.channels.cache.get(config.Portfolio.Category)
		category.children.forEach(function(pchannel) =>{
			if(pchannel.id == newChannel.id){
				newChannel.permissionOverwrites.cache.forEach(function(overwrite) =>{
					if(overwrite.type === "member"){
						let member = guild.members.cache.get(overwrite.id)
						GerneralFunctions.SyncPortfolios(db, newChannel, member)
					}
				});
			}
		});
	});


	client.on("messageDelete", function(message){
		if(message.channel == config.Contest.Channel)
		{
			Contest.RemSub(client, message, config)
		}
	});

}
catch(err) {
	console.log("Discord.js Error")
	console.log(err)
}




//newjson = { "name":message.author.username, "content":message.content};
