const Discord = require('discord.js');

// Main Token & Config
const Token = require('./../tokens/PL.json');
const config = require('./config.json');
// Test Token
//const Token = require('./../tokens/Test.json');
//const config = require('./testconfig.json');



//Modules
const RoleReactions     = require('./Functions/RoleReactions.js');
const PhotoReactions    = require('./Functions/PhotoReactions.js');
const GerneralFunctions = require('./Functions/GeneralFunctions.js');

//Client Startup
try{
	const client = new Discord.Client();
	client.login(Token['Token']);

	client.on('ready', message => {
    GerneralFunctions.Log(config, client, "Start Server")
	});

	client.on('message', message => {

		if(message.channel.id == config.PhotoReactMod.Photoid && message.author.bot == false){PhotoReactions.addreactions(config, message);}
		if(message.content.startsWith(config.General.Prefix))
		{
			let args = message.content.split(" ");
      if(args.length > 1)
  			switch(args[1].toLowerCase()){
  				case "getrole":
  					RoleReactions.RoleMenu(config, message, args)
  					break;
          case "ping":
            GerneralFunctions.Ping(message)
            break;
          case "help":
            GerneralFunctions.HelpPage(message)
            break;
  				default:
  					GerneralFunctions.HelpPage(config, message)
  					break;
  			}
      else{GerneralFunctions.HelpPage(config, message)}
		}
	});

	client.on('messageReactionAdd', (reaction, user) => {
		if(reaction.message.author.bot == false){
			PhotoReactions.copyimage(config, reaction, user, client);
		} else {
			RoleReactions.GetRole(config, client, reaction, user)
		}

	});
}
catch(err) {
	GerneralFunctions.Log(config, client, err)
}