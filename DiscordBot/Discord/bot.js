var Users = require('../Internal/DualUniverseData/DU/users.json');// users
var Orgs = require('../Internal/DualUniverseData/DU/orgs.json'); // organizations
var Discord = require('discord.js'); // Discord bot stuff
var bot = new Discord.Client(); // the client 
var config = require('../Config/config.json'); // Retrive main config files
const prefix = "[]"; // prefix. can be changed by you if you want
var deleteCMDs = true; // should it delete the command message?
const ORGAVATARBASEURL = 'https://auth-media.s3.amazonaws.com/media/organization_@/logo.png'; // just need IDs now
const USEAVATARBASEURL = 'https://auth-media.s3.amazonaws.com/media/user_$/avatar.png'; // just need IDs now

bot.on("message", (message) => { // when the bot sees a message
	if(message.content.toLowerCase().startsWith(prefix + 'getinfo')){ // look for if it is the 'get info' command
		var cmd = message.content.substring((prefix + 'getinfo ').length); // cut off the getinfo command
		if(cmd.toLowerCase().startsWith("user")){ // are they asking for user info?
			var subCMD = cmd.substring("user ".length).toLowerCase(); // yes? okay, remove that part of the command
			for(let user of Users){ // for all users, 
				if(user.user.toLowerCase() === subCMD){ // if their name is the defined user
					var embed = new Discord.RichEmbed() // create a new rich embed
						.setTitle(user.user) // and give it the title of the player's name
						.setFooter('Dual Universe',message.author.avatarURL) // set the footer to 'Dual Universe' and the user's avatar as the footer image
						.setTimestamp(); // set the timestamp of the message
					var counter = 22; // 22 records will be shown...
					for(let org of user.organizations){ // for every organization in the users list
						if(counter >= 1){ // if we are not on the 21st entry
							embed.addField(org.orgname,"Joined: `" + org.joinDate + "` || Status: `"+org.status+"`"); // add the entry to the rich embed
						}else{ // if we are on the last entry
							embed.addField(org.orgname,"Joined: `" + org.joinDate + "` || Status: `" + org.status + "`\n and `" + (user.organizations.length - 22) + "` more..." ); // put the last entry and say that there are however many left...
						}
					}
					deleteCMDs ? message.delete(): deleteCMDs = false; // delete the cmd message if deleteCMDs is true
					message.channel.send({embed}); // send the message
					return;// and get outta here!
				}
			}
			message.reply("Im sorry, but the User, " + subCMD + " doesn't exist..."); // oh, but if we reach this line, then no user was found, and we tell them the user doesn't exist
		}else if(cmd.toLowerCase().startsWith("org")){ // if they are looking for an org
			var subCMD = cmd.substring("org ".length).toLowerCase(); // remove that part of the command
			for(let org of Orgs){ // and for every org
				if(org.name.toLowerCase() === subCMD){// look for one with the same name
					var embed = new Discord.RichEmbed() // and make a new rich embed
						.setTitle(org.name) // with the same name
						.setDescription("Created on:" + org.createdDate + "\n**MEMBERS:**") // descriptive text
						.setFooter('Dual Universe',message.author.avatarURL) // more stuff
						.setTimestamp(); // and time
					var counter = 22; // for 22 users
					for(let user of org.members){ //for all members in the org
						if(counter >= 1){// and not the last record
							embed.addField(user.name,"Joined: `" + user.joinDate + "` || Status: `" + user.status + "` ");// add them to the embed
						}else{ // if it is the last one
							embed.addField(user.name,"Joined: `" + user.joinDate + "` || Status: `" + user.status + "`\n and `" + (org.members.length - 22) + "` more..." );// add them to the embed and leave
						}
					}
					
					
					deleteCMDs ? message.delete(): deleteCMDs = false;// again, if true, delete the command
					message.channel.send({embed}); // send the message
					return;// and gtfo
				}
			}
			message.reply("Im sorry, but the Organization, " + subCMD + " doesn't exist...");// oh, and if the org ins't there, say so
		}	
	}
});

bot.login(config.Discord.Token);// oh, can't forget to log in