// Houses the info for the main bot
const config = require('../Config/config.json'); // Master Config File
const Discord = require('Discord.js'); // Load Discord.Js Library
const Probe = require('pmx').probe(); // Connect to keymetrics
const async = require('async'); // Async tasks
const fs = require('fs'); // File System
const events = require('events'); // Events listener
const path = require('path'); 
const bodyParser = require('body-parser');
const mysql = require('mysql'); // Connect and login to the Database Server
const Token = config.Discord.Token; // Get Discord Login Token
const formidable = require('formidable');
const msgEmbedToRich = require("discordjs-embed-converter").msgEmbedToRich;
const utl = require('util');
const DiscordClient = new Discord.Client(); // Create new Discord Client
const connection = mysql.createConnection({
	host: config.SQL.NodeSQL.host,
	user: 'Dev',
	port: config.SQL.NodeSQL.port,
	database: 'master_discord_org'
}); // Test Database Local


//connection.query('SELECT * FROM master_discord_org.corps');

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
}); // Indentify if connection was succesful

// Delay commands to limit use
const talkedRecently = new Set();
// Delay commands to limit use

DiscordClient.on('ready', () => {
	DiscordClient.user.setPresence({ game: {name: 'Dual Universe', type: 1 } });
}); // Set the game status to Dual Universe

DiscordClient.on('ready', () => {
  console.log(`Logged in as ${DiscordClient.user.tag}!`);
}); // Log and notify when bot has connected to Discord.

DiscordClient.on('message', (message) => {
	if (!message.content.startsWith(config.Discord.Artemis.Options.prefix)) return;
	if (!message.content.startsWith(config.Discord.Artemis.Options.prefix) || message.author.bot) return;
	if (talkedRecently.has(message.author.id)) return;
	
	if (message.content.startsWith(config.Discord.Artemis.Options.prefix + "Avatar")) {
	message.channel.send(message.author.avatarURL);
	} else
	if (message.content.startsWith(config.Discord.Artemis.Options.prefix + "Query")) {
		const data = message.content; 
		connection.query('SELECT * FROM master_discord_org.corps;', function (results, err, fields) {
			message.channel.send({embed: {
				color: "3447003",
				title: "Test",
				description: "test",
				fields: [{
					name: "Test",
					value: results,
				}],
			}
		})
	})
	} else
	if (message.content.startsWith(config.Discord.Artemis.Options.prefix + "Kill")) {
		DiscordClient.destroy();
	} else
	if (message.content.startsWith(config.Discord.Artemis.Options.prefix + "Dashboard")) {
		message.delete()
		message.channel.send("I'm currently sitting in "+DiscordClient.guilds.size+" servers");
		message.channel.send({embed: {
			color: "3447003",
			title: "ToasTec Status",
			description: "Welcome to Dual Universe ToasTec!",
			fields: [{
				name: "ToasTec Dashboard",
				value: "Dual Universe ToasTec, [Dashboard](" + config.Commando.DashboardUrl + ") !"
			}],
		}
	})
}}); // Listen for chat messages that match the prefix and value and then respond with the array


// Commands

// Error Handling
new Promise(() => { throw new Error('exception!'); });
// Error Handling

// This allows users to gain levels the commands are +levels but this can be improved, Levels stored in ./pointsSystem
let points = JSON.parse(fs.readFileSync("./pointsSystem/points.json", "utf8"));
const prefix = "+";

DiscordClient.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
  if (message.author.bot) return;

  if (!points[message.author.id]) points[message.author.id] = {
    points: 0,
    level: 0
  };
  let userData = points[message.author.id];
  userData.points++;

  let curLevel = Math.floor(0.5 * Math.sqrt(userData.points)); // Upgraded percentage from 0.1 to 0.5
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`You"ve leveled up to level **${curLevel}**! Ain"t that dandy?`);
  }

  if (message.content.startsWith(prefix + "level")) {
    message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
  }
  fs.writeFile("./pointsSystem/points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
  }); // Make sure it writes back to /pointsSystem/points.json file.

});

// This is to send a webhook event to #node-output in Discord
//const hook = new Discord.WebhookClient(config.NodeSQL.ID,config.//NodeSQL.Token);
//hook.send('connection');

//const SQLS = connection.query({
//	sql: 'SELECT Name
//FROM `master_discord_org`.`corps` WHERE =?';", function (err, result, message) {
//	
//}});

// This tells the client to login using the provided information
DiscordClient.login(config.Discord.Artemis.Tokens.Token);
// Login with Token

// This greats new users joining the server!
DiscordClient.on("guildMemberAdd", (member) => {
  console.log(`New User "${member.user.username}" has joined "${member.guild.name}"` );
  member.guild.defaultChannel.send(`"${member.user.username}" has joined this server`);
});
//