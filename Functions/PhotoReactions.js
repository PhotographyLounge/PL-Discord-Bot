const Discord = require('discord.js');
const GerneralFunctions = require('./GeneralFunctions.js');

function addreactions(config, message) {
	if(message.attachments.size === 1)
	{
		message.react(config.PhotoReactMod.Thubmbsup)
		message.react(config.PhotoReactMod.Thubmbsdown)
		message.react(config.PhotoReactMod.Feedback)

		GerneralFunctions.LogToSIEM({"Module":"PhotoReactions", "Function":"NewPhoto", "Username":message.author.username})
	}
	else if (message.attachments.size > 1 && config.PhotoReactMod.Multattch == false)
	{
		message.delete();
		id = message.reply("Sending multiple attachments is prohibited").then(msg => {msg.delete({timeout:config.PhotoReactMod.Timeout})});				
	}
	else if (message.attachments.size < 1 && config.PhotoReactMod.Text == false)
	{
		message.delete();
		id = message.reply("Sending text in this chat is prohibited").then(msg => {msg.delete({timeout:config.PhotoReactMod.Timeout})});				
	}
	return;
}

function copyimage(config, reaction, user, client) {
		
	if(reaction.message.channel.id == config.PhotoReactMod.Photoid || (reaction.message.channel.parentID == config.PhotoReactMod.Portfolioid && reaction.message.attachments.size > 0))
	{
		if(reaction.emoji.name === "💬" && user.bot == false && reaction.message.author.id != user.id) {

	    	//Reply
	    	GerneralFunctions.transientResponseEmbed(config, reaction.message, 10, "The picture got copied to " +  client.channels.cache.get(config.PhotoReactMod.Feedbackid).toString() + ". Tell the creator what you think about it.");

	    	// Copy
	    	var channel = client.channels.cache.get(config.PhotoReactMod.Feedbackid);
	        reaction.message.attachments.forEach(Attachment => {GerneralFunctions.ImageEmbed(config, channel, Attachment.url, "Image by: <@" + reaction.message.author.id.toString() +">");})
	    	channel.send("<@" + user.id + "> would like to give feedback on your photo <@" + reaction.message.author.id + ">.")

	    	GerneralFunctions.LogToSIEM({"Module":"PhotoReactions", "Function":"CopyPhoto", "Author":reaction.message.author.username, "Copy Issuer":user.username})
	    }
	}
}

module.exports.addreactions = addreactions;
module.exports.copyimage = copyimage;