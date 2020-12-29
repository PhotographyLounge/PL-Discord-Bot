const Discord = require('discord.js');
const Token = require('./../Token/PL.json');
const config = require('./config.json');

//Modules
const PhotoReaktions = require('./Functions/PhotoReactions.js');

//Client Startup
const client = new Discord.Client();
client.login(Token['Token']);

client.on('message', message => {
	if(message.channel.id == config.photoid && message.author.bot == false){PhotoReaktions.addreactions(message);}
});

client.on('messageReactionAdd', (reaction, user) => {
	PhotoReaktions.copyimage(reaction, user, client);
});