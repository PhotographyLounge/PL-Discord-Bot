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

function log(client, message){
	channel = client.channels.cache.get(config.log);
	message = "<@345276559038611466>" + message;

	while(message.length > 1999)
	{
		text = message.substring(0, 1999);
		channel.send(text)
		message = message.substring(1999);
	}
	channel.send(message)
}

module.exports.ImageEmbed = ImageEmbed;
module.exports.transientResponseEmbed = transientResponseEmbed;
module.exports.ping = ping;
module.exports.log = log;