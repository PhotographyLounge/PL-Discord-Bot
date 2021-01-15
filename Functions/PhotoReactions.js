const Discord = require('discord.js');
const GerneralFunctions = require('./GeneralFunctions.js');

function addreactions(config, message) {
	if(message.attachments.size === 1)
	{
		message.react(config.PhotoReactMod.Thubmbsup)
		message.react(config.PhotoReactMod.Thubmbsdown)
		message.react(config.PhotoReactMod.Feedback)
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
		console.log(reaction.message)
		if(reaction.emoji.name === "💬" && user.bot == false ) { // && reaction.message.author.id != user.id

	    	//Reply
	    	GerneralFunctions.transientResponseEmbed(config, reaction.message, 10, "The picture got copied to " +  client.channels.cache.get(config.PhotoReactMod.Feedbackid).toString() + ". Tell the creator what you think about it.");

	    	// Copy
	    	var channel = client.channels.cache.get(config.PhotoReactMod.Feedbackid);
	        reaction.message.attachments.forEach(Attachment => {GerneralFunctions.ImageEmbed(config, channel, Attachment.url, "Image by: <@" + reaction.message.author.id.toString() +">");})
	    	channel.send("<@" + user.id + "> would like to give feedback on your photo <@" + reaction.message.author.id + ">.")
	    }
	}
}

module.exports.addreactions = addreactions;
module.exports.copyimage = copyimage;

/*
Message {
  channel: TextChannel {
    type: 'text',
    deleted: false,
    id: '790514023325368350',
    name: '📸-photos',
    rawPosition: 4,
    parentID: '790513890407874571',
    permissionOverwrites: Collection [Map] {},
    topic: null,
    lastMessageID: '799559706179403808',
    rateLimitPerUser: 0,
    lastPinTimestamp: null,
    guild: Guild {
      members: [GuildMemberManager],
      channels: [GuildChannelManager],
      roles: [RoleManager],
      presences: [PresenceManager],
      voiceStates: [VoiceStateManager],
      deleted: false,
      available: true,
      id: '709753416938946580',
      shardID: 0,
      name: "dessyboy's bot testing server",
      icon: '351eec2df868916f93b54a9f79d5e971',
      splash: null,
      discoverySplash: null,
      region: 'europe',
      memberCount: 10,
      large: false,
      features: [],
      applicationID: null,
      afkTimeout: 300,
      afkChannelID: null,
      systemChannelID: '709753416938946583',
      embedEnabled: undefined,
      premiumTier: 0,
      premiumSubscriptionCount: 0,
      verificationLevel: 'NONE',
      explicitContentFilter: 'DISABLED',
      mfaLevel: 0,
      joinedTimestamp: 1609234028926,
      defaultMessageNotifications: 'MENTIONS',
      systemChannelFlags: [SystemChannelFlags],
      maximumMembers: 100000,
      maximumPresences: null,
      approximateMemberCount: null,
      approximatePresenceCount: null,
      vanityURLCode: null,
      vanityURLUses: null,
      description: null,
      banner: null,
      rulesChannelID: null,
      publicUpdatesChannelID: null,
      preferredLocale: 'en-US',
      ownerID: '345276559038611466',
      emojis: [GuildEmojiManager]
    },
    messages: MessageManager {
      cacheType: [class LimitedCollection extends Collection],
      cache: [LimitedCollection [Map]],
      channel: [Circular]
    },
    nsfw: false,
    _typing: Map {}
  },
  deleted: false,
  id: '799559706179403808',
  type: 'DEFAULT',
  system: false,
  content: '',
  author: User {
    id: '345276559038611466',
    system: false,
    locale: null,
    flags: UserFlags { bitfield: 256 },
    username: 'dessyboy',
    bot: false,
    discriminator: '0009',
    avatar: 'a_2d25e2bca746d17cd13dfc3e614cd552',
    lastMessageID: '799559706179403808',
    lastMessageChannelID: '790514023325368350'
  },
  pinned: false,
  tts: false,
  nonce: null,
  embeds: [],
  attachments: Collection [Map] {
    '799559705966018560' => MessageAttachment {
      attachment: 'https://cdn.discordapp.com/attachments/790514023325368350/799559705966018560/bd5493db059719abc84ae9237a1a58c1213f9074.png',
      name: 'bd5493db059719abc84ae9237a1a58c1213f9074.png',
      id: '799559705966018560',
      size: 102308,
      url: 'https://cdn.discordapp.com/attachments/790514023325368350/799559705966018560/bd5493db059719abc84ae9237a1a58c1213f9074.png',
      proxyURL: 'https://media.discordapp.net/attachments/790514023325368350/799559705966018560/bd5493db059719abc84ae9237a1a58c1213f9074.png',
      height: 150,
      width: 150
    }
  },
  createdTimestamp: 1610700289054,
  editedTimestamp: 0,
  reactions: ReactionManager {
    cacheType: [class Collection extends Collection],
    cache: Collection [Map] {
      '👍' => [MessageReaction],
      '👎' => [MessageReaction],
      '💬' => [MessageReaction]
    },
    message: [Circular]
  },
  mentions: MessageMentions {
    everyone: false,
    users: Collection [Map] {},
    roles: Collection [Map] {},
    _members: null,
    _channels: null,
    crosspostedChannels: Collection [Map] {}
  },
  webhookID: null,
  application: null,
  activity: null,
  _edits: [],
  flags: MessageFlags { bitfield: 0 },
  reference: null
}
*/

