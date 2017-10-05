// Houses the info for the main bot
const config = require('./config.json');
const Discord = require('Discord.js');
const Probe = require('pmx').probe();
const async = require('async');
const fs = require('fs');
const events = require('events');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const Token = config.Discord.Token;
const formidable = require('formidable');
const utl = require('util');
const DiscordClient = new Discord.Client();
const connection = mysql.createConnection({
	host: config.NodeSQL.host,
	user: config.NodeSQL.user,
	port: config.NodeSQL.port,
	password: config.NodeSQL.password,
	database: config.NodeSQL.database
});

connection.connect(function(err) {
	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
	}
	console.log('connected as id ' + connection.threadId);
});

DiscordClient.on('ready', () => {
	DiscordClient.user.setPresence({ game: {name: 'Dual Universe', type: 1 } });
});

DiscordClient.on('ready', () => {
  console.log(`Logged in as ${DiscordClient.user.tag}!`);
});

DiscordClient.on('message', (message) => {
	if (!message.content.startsWith(config.Discord.prefix)) return;
	if (!message.content.startsWith(config.Discord.prefix) || message.author.bot) return;
	
	if (message.content.startsWith(config.Discord.prefix + "Avatar")) {
	message.channel.send(message.author.avatarURL);
	} else
	if (message.content.startsWith(config.Discord.prefix + "Query")) {
		
	}
	if (message.content.startsWith(config.Discord.prefix + "Kill")) {
	connection.end(function(err) {
		console.log(err);
	});
	DiscordClient.destroy();
	} else
	if (message.content.startsWith(config.Discord.prefix + "Dashboard")) {
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
}});
// Commands

// Error Handling
new Promise(() => { throw new Error('exception!'); });
// Error Handling

// Points system needs to be updated
let points = JSON.parse(fs.readFileSync("./points.json", "utf8"));
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

  let curLevel = Math.floor(0.1 * Math.sqrt(userData.points));
  if (curLevel > userData.level) {
    // Level up!
    userData.level = curLevel;
    message.reply(`You"ve leveled up to level **${curLevel}**! Ain"t that dandy?`);
  }

  if (message.content.startsWith(prefix + "level")) {
    message.reply(`You are currently level ${userData.level}, with ${userData.points} points.`);
  }
  fs.writeFile("./points.json", JSON.stringify(points), (err) => {
    if (err) console.error(err)
  });

});
// Points system needs to be updated

// Login with Token
DiscordClient.login(config.Discord.Token);
// Login with Token