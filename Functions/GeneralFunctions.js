const Discord = require('discord.js');
var net = require('net');



function HelpPage(config, message) {
	var helpEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setAuthor(config.General.Name, config.General.Thumbnail)
		.setTitle('Command Help Page')
		.setTimestamp()
		.addFields(
			{name:'**__Get Role:__**',value: "```md\n" + config.General.Prefix + " getrole <category>```\n"},
		)
	message.channel.send({ embeds: [helpEmbed] }).then(msg => {setTimeout(() => msg.delete(), 30 * 1000)});
	return;
}

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
	message.channel.send({ embeds: [helpEmbed] }).then(msg => {setTimeout(() => msg.delete(), 30 * 1000)});
	return;
}

function RoleEmbed(config, message, time, text, category, reactions) {
	var roleEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setAuthor(config.General.Name, config.General.Thumbnail)
		.setTitle('Reaction Roles')
		.setDescription('Category: ' + category)
		.addField('React to the message to get the roles', ' \n' + text)
		//.addField(' ', )
	//responseEmbed.setDescription(text);
	message.channel.send({ embeds: [roleEmbed] }).then(msg => {
		reactions.forEach(function(reaction){msg.react(reaction)})
		setTimeout(() => msg.delete(), 30 * 1000)
	})
	return 
}

function PollEmbed(config, channel, pfp, headline, description) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setAuthor("Poll by: " + headline, pfp)
		.setDescription(description)
	channel.send({ embeds: [responseEmbed] })
		.then(embedMessage => {
			embedMessage.react(config.PhotoReactMod.Thubmbsup)
			embedMessage.react(config.PhotoReactMod.Thubmbsdown)
		})
	return 
}

function transientResponseEmbed(config, message, time, text) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)

	responseEmbed.setDescription(text);
	message.channel.send({ embeds: [responseEmbed] }).then(msg => {setTimeout(() => msg.delete(), 5000)});
	return 
}



function ImageEmbed(config, channel, iamgeurl, pfp, headline, description) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.General.EmbedColour)
		.setImage(iamgeurl)
		.setAuthor(headline, pfp)
		.setDescription(description)
	channel.send({ embeds: [responseEmbed] })
	return 
}

function Ping(message){
	message.reply('pong!');
}

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
module.exports.PollEmbed = PollEmbed;
module.exports.transientResponseEmbed = transientResponseEmbed;
module.exports.Ping = Ping;
module.exports.Log = Log;
