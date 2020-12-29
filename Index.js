const Discord = require('discord.js');
const Token = require('./../Token/PL.json');
const config = require('./config.json');

//Modules
const PhotoReaktions = require('./Functions/PhotoReactions.js');
const GerneralFunctions = require('./Functions/GeneralFunctions.js');

//Client Startup
const client = new Discord.Client();
client.login(Token['Token']);

client.on('message', message => {
	try {
		if(message.channel.id == config.photoid && message.author.bot == false){PhotoReaktions.addreactions(message);}
	}
	catch(err) {
		GerneralFunctions.log(client, err)
	}
});

client.on('messageReactionAdd', (reaction, user) => {
	try {
		PhotoReaktions.copyimage(reaction, user, client);
	}
	catch(err) {
		GerneralFunctions.log(client, err)
	}
});
