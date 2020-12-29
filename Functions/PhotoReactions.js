const Discord = require('discord.js');
const config = require('./../config.json');

const GerneralFunctions = require('./GeneralFunctions.js');

function addreactions(message) {
	if(message.attachments.size === 1)
	{
		message.react(config.Thubmbsup)
		message.react(config.Thubmbsdown)
		message.react(config.Feedback)
	}
	else if (message.attachments.size > 1 && config.multipleattchments == false)
	{
		message.delete();
		id = message.reply("Sending multiple attachments is prohibited").then(msg => {msg.delete({timeout:config.timeout})});				
	}
	else if (message.attachments.size < 1 && config.multipleattchments == false)
	{
		message.delete();
		id = message.reply("Sending text in this chat is prohibited").then(msg => {msg.delete({timeout:config.timeout})});				
	}
	return;
}

function copyimage(reaction, user, client) {
	if(reaction.emoji.name === config.Feedback && user.bot == false) {
    	
    	//Reply
    	GerneralFunctions.transientResponseEmbed(reaction.message, "The picture got copied to " +  client.channels.cache.get(config.feedback).toString() + ". Tell the creator what you think about it.");



    	// Copy
    	channel = client.channels.cache.get(config.feedback);
        reaction.message.attachments.forEach(Attachment => {GerneralFunctions.ImageEmbed(channel, Attachment.url, "Image by: <@" + reaction.message.author.id.toString() +">");})
    }
}

module.exports.addreactions = addreactions;
module.exports.copyimage = copyimage;