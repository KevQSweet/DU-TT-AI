const config = require('./config.json');
const Commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;
const async = require('async');
const fs = require('fs');
const events = require('events');
const path = require('path');
const bodyParser = require('body-parser');
const Token = config.Discord.Token;
const formidable = require('formidable');
const utl = require('util');
const commandoClient = new Commando.Client({
	owner: '247176974164819968',
	commandPrefix: '[]',
	disableEveryone: true,
});

// Set Playing or Streaming game and presence
commandoClient.on('ready', () => {
	commandoClient.user.setPresence({ game: {name: 'Dual Universe ToasTec', type: 1 } });
});
// ------------------------------------------------


commandoClient.on('ready', () => {
  console.log(`Logged in as ${commandoClient.user.tag}!`);
});
// Alerts when logged in.


// Register Basic Commands
commandoClient.on('message', (message) => {
	if (!message.content.startsWith(config.Commando.prefix)) return;
	if (!message.content.startsWith(config.Commando.prefix) || message.author.bot) return;
	if (message.content.startsWith(config.Commando.prefix + "Kill")) {
		message.channel.send("No!!!!")
		commandoClient.destroy()
		console.log('Commando Discord Killed')
		process.exit();
	}
});
// Basic internal commands Handling for Commando Bot
new Promise(() => { throw new Error('exception!'); });
// Register Basic Commands


// Log Errors and warnings to console No need to change anything below.. - Debug output for executed commands
commandoClient
	.on('error', console.error)
	.on('warn', console.warn)
	.on('debug', console.log)
	.on('ready', () => {
		console.log(`Client ready; logged in as ${commandoClient.user.username}#${commandoClient.user.discriminator} (${commandoClient.user.id})`);
	})
	.on('disconnect', () => { console.warn('Disconnected!'); })
	.on('reconnecting', () => { console.warn('Reconnecting...'); })
	.on('commandError', (cmd, err) => {
		if(err instanceof commando.FriendlyError) return;
		console.error(`Error in command ${cmd.groupID}:${cmd.memberName}`, err);
	})
	.on('commandBlocked', (msg, reason) => {
		console.log(oneLine`
			Command ${msg.command ? `${msg.command.groupID}:${msg.command.memberName}` : ''}
			blocked; ${reason}
		`);
	})
	.on('commandPrefixChange', (guild, prefix) => {
		console.log(oneLine`
			Prefix ${prefix === '' ? 'removed' : `changed to ${prefix || 'the default'}`}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('commandStatusChange', (guild, command, enabled) => {
		console.log(oneLine`
			Command ${command.groupID}:${command.memberName}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	})
	.on('groupStatusChange', (guild, group, enabled) => {
		console.log(oneLine`
			Group ${group.id}
			${enabled ? 'enabled' : 'disabled'}
			${guild ? `in guild ${guild.name} (${guild.id})` : 'globally'}.
		`);
	});
// No need to change anything above this line.. - Debug output for executed commands

// Match Commands with directory on script - name must be lowercase.
commandoClient.registry
	.registerGroup(
	['math', 'Math'],
	['fun', 'Fun Commands'],
	['borst', 'Borst Functions'],
	['dual universe', 'Dual Universe Features'],
	['management', 'A.I. Management'],
	['team', 'Team related Functions'],
	['corps', 'DU Corp match']
	)
	.registerDefaults()
	.registerCommandsIn(path.join(__dirname, 'commands'));
// Register and join Directorys to bot



// Log the bot into Discord
commandoClient.login(config.Commando.Token);
// Log the bot into Discord