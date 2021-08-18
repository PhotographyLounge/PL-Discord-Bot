const Discord = require('discord.js');
const GerneralFunctions = require('./GeneralFunctions.js');

function RoleMenu(config, message, args){	
	if(args.length == 3)
	{
		var Needle = args[2].toLowerCase()
		if(config.ReactMod.Categories.hasOwnProperty(Needle)){
			let text = ""
			var reactions = [];
			for (key in config.ReactMod.Categories[Needle]) {
				text = text +  config.ReactMod.Categories[Needle][key].ReactEmoji + " - " + key + "\n"
				reactions.push(config.ReactMod.Categories[Needle][key].ReactEmoji)
			}
			var Category = Needle.charAt(0).toUpperCase() + Needle.substring(1);
			GerneralFunctions.RoleEmbed(config, message, 30, text, Category, reactions);
		}
		else
		{
			GerneralFunctions.RoleHelpPage(config, message)
		}
	}
	else
	{
		GerneralFunctions.RoleHelpPage(config, message)
		return
	}
}

function GetRole(config, client, reaction, user){

	if(user.bot == false && reaction.message.embeds[0] != undefined && reaction.message.author.bot == false)
	{
		var Needle = reaction.message.embeds[0].description.split(" ")[1].toLowerCase()
		for (key in config.ReactMod.Categories[Needle]) {
			if(config.ReactMod.Categories[Needle][key].ReactEmoji == reaction._emoji.name)
			{
				console.log(user)
				let member   = reaction.message.guild.members.cache.get(user.id)
				let channel  = client.channels.cache.get(reaction.message.channel.id)

				if(member.roles.cache.has(config.ReactMod.Categories[Needle][key].RoleId))
				{
					member.roles.remove(config.ReactMod.Categories[Needle][key].RoleId)
					channel.send('Removed role ' + key + ' from ' + member.displayName).then(msg => {setTimeout(() => msg.delete(), 5000)});
				}
				else
				{
					member.roles.add(config.ReactMod.Categories[Needle][key].RoleId)
					channel.send('Added role ' + key + ' to ' + member.displayName).then(msg => {setTimeout(() => msg.delete(), 5000)});
				}
			}
		}		
	}
}

module.exports.RoleMenu = RoleMenu;
module.exports.GetRole  = GetRole;