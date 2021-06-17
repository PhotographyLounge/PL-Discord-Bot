const Discord = require('discord.js');
const fs = require('fs');

// Main Token & Config
const Token = require('./../tokens/PL.json');
const config = require('./config.json');
// Test Token
//const Token = require('./../tokens/Test.json');
//const config = require('./testconfig.json');



//Modules
const RoleReactions     = require('./Functions/RoleReactions.js');
const PhotoReactions    = require('./Functions/PhotoReactions.js');
const GerneralFunctions = require('./Functions/GeneralFunctions.js');
const Contest           = require('./Functions/ContestHelper.js');

//Client Startup
try{
	const client = new Discord.Client();
	client.login(Token['Token']);

	client.on('ready', message => {
		try{
		    GerneralFunctions.Log(config, client, "Server Restart")
		    Contest.LoadSubmissions(client, config)
			GerneralFunctions.LogToSIEM({"Event":"Sever Restart"})


		}
		catch(err) {
			console.log("Discord.js Error")
			console.log(err)
		}
	});

	client.on('message', message => {
		if(message.author.bot == true){return}

		if      (message.channel.id == config.PhotoReactMod.Photoid){PhotoReactions.addreactions(config, message);}
		else if (message.channel.id == config.Contest.Channel      ){Contest.AddSub(client, message, config);}
		
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
		if(reaction.message.author.id == user.id && reaction.message.channel.id == config.Contest.Channel)
		{
			reaction.users.remove(user.id);
		}
		else
		{
			if(reaction.message.author.bot == false){
				PhotoReactions.copyimage(config, reaction, user, client);
			} 
			if(reaction.message.author.username == config.General.Name) 
			{
				RoleReactions.GetRole(config, client, reaction, user) // Fail Reacton to oher bot
			}
		}

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