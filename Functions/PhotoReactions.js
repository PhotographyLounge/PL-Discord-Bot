const Discord = require('discord.js');
const GerneralFunctions = require('./GeneralFunctions.js');

async function addreactions(config, message) {
	if(message.attachments.size === 1)
	{
		message.react(config.PhotoReactMod.Thubmbsup)
		message.react(config.PhotoReactMod.Thubmbsdown)
		message.react(config.PhotoReactMod.Feedback)
	}
	else if (message.attachments.size > 1 && config.PhotoReactMod.Multattch == false)
	{
		await message.reply("Sending text in this chat is prohibited").then(msg => {setTimeout(() => msg.delete(), config.PhotoReactMod.Timeout)});
		message.delete();				
	}
	else if (message.attachments.size < 1 && config.PhotoReactMod.Text == false)
	{
		await message.reply("Sending text in this chat is prohibited").then(msg => {setTimeout(() => msg.delete(), config.PhotoReactMod.Timeout)});	
		message.delete();			
	}
	return;
}

function copyimage(config, reaction, user, client) {
		
	if(reaction.message.channel.id == config.PhotoReactMod.Photoid || (reaction.message.channel.parentID == config.PhotoReactMod.Portfolioid && reaction.message.attachments.size > 0))
	{
		if(reaction.emoji.name === config.PhotoReactMod.Feedback && user.bot == false) {

	    	//Reply
	    	GerneralFunctions.transientResponseEmbed(config, reaction.message, 10, "The picture got copied to " +  client.channels.cache.get(config.PhotoReactMod.Feedbackid).toString() + ". Tell the creator what you think about it.");

	    	// Copy
	    	var channel = client.channels.cache.get(config.PhotoReactMod.Feedbackid);
	        reaction.message.attachments.forEach(Attachment => {GerneralFunctions.ImageEmbed(config, channel, Attachment.url, reaction.message.author.displayAvatarURL(), "Image by: " + reaction.message.author.username, "In channel <#" + reaction.message.channel.id +">");})
	    	channel.send("<@" + user.id + "> would like to give feedback on your photo <@" + reaction.message.author.id + ">.")
	    }
	}
}

module.exports.addreactions = addreactions;
module.exports.copyimage = copyimage;