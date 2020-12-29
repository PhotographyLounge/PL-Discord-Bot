const Discord = require('discord.js');
const config = require('./../config.json');




function transientResponseEmbed(message, text) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.EmbedColour)

	responseEmbed.setDescription(text);
	message.channel.send(responseEmbed).then(msg => {msg.delete({timeout:10000})});
	return 
}

function ImageEmbed(channel, iamgeurl, description) {
	var responseEmbed = new Discord.MessageEmbed()
		.setColor(config.EmbedColour)
		.setImage(iamgeurl)
		.setDescription(description)
	channel.send(responseEmbed)
	return 
}

function ping(message){message.reply('pong!');}


module.exports.ImageEmbed = ImageEmbed;
module.exports.transientResponseEmbed = transientResponseEmbed;
module.exports.ping = ping;
