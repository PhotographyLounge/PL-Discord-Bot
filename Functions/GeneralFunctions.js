const Discord = require('discord.js');

function RoleHelpPage(config, message) {
	var helpEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setAuthor(config.General.Name, config.General.Thumbnail)
		.setTitle('Get Role:')
		.setTimestamp()
		.addFields(
			{name:'**Syntax:**',value: "```md\n" + config.General.Prefix + " getrole <category>```\n"},
			{name:'Categories:',value: "```md\nPronouns```"},
		)
	message.channel.send(helpEmbed).then(msg => {msg.delete({timeout:30 * 1000})});;
	return;
}

function HelpPage(config, message) {
	var helpEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setAuthor(config.General.Name, config.General.Thumbnail)
		.setTitle('Command Help Page')
		.setTimestamp()
		.addFields(
			{name:'**__Get Role:__**',value: "```md\n" + config.General.Prefix + " getrole <category>```\n"},
		)
	message.channel.send(helpEmbed).then(msg => {msg.delete({timeout:30 * 1000})});;
	return;
}

function transientResponseEmbed(config, message, time, text) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)

	responseEmbed.setDescription(text);
	message.channel.send(responseEmbed).then(msg => {msg.delete({timeout:time * 1000})});
	return 
}

function RoleEmbed(config, message, time, text, category, reactions) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setAuthor(config.General.Name, config.General.Thumbnail)
		.setTitle('Reaction Roles')
		.setDescription('Category: ' + category)
		.addField('React to the message to get the roles', ' \n' + text)
		//.addField(' ', )
	//responseEmbed.setDescription(text);
	message.channel.send(responseEmbed).then(msg => {
		reactions.forEach(function(reaction){msg.react(reaction)});
		msg.delete({timeout:time * 1000})
	});
	return 
}

function ImageEmbed(config, channel, iamgeurl, description) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setImage(iamgeurl)
		.setDescription(description)
	channel.send(responseEmbed)
	return 
}

function Ping(message){message.reply('pong!');}

function Log(config, client, message){
	channel = client.guilds.cache.get(config.Logging.Server).channels.cache.get(config.Logging.Channel)
	var date = new Date()
	message = "["+ (date.getHours() + 1) + ":" + date.getMinutes() + ":" + date.getSeconds() + "] <@" + config.Logging.Mod + ">" + message;

	while(message.length > 1999)
	{
		text = message.substring(0, 1999);
		channel.send(text)
		message = message.substring(1999);
	}
	channel.send(message)
}

module.exports.ImageEmbed = ImageEmbed;
module.exports.HelpPage = HelpPage;
module.exports.RoleHelpPage = RoleHelpPage;
module.exports.RoleEmbed = RoleEmbed;
module.exports.transientResponseEmbed = transientResponseEmbed;
module.exports.Ping = Ping;
module.exports.Log = Log;

