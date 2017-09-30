//  Libraries
const config = require('./config.json'),
	Commando = require('discord.js-commando'),
	Discord = require('discord.js'),
	async = require('async'),
	util = require('util'),
	oneLine = require('common-tags').oneLine,
	bPromise = require('bluebird'),
    fs = require('fs'),
	path = require('path'),
	http = require('http'),
	https = require('https'),
	url = require('url'),
	events = require('events'),
	formidable = require('formidable'),
	dgram = require('dgram'),
	dns = require('dns'),
	tls = require('tls'),
	net = require('net'),
	bodyParser = require('body-parser'),
	express = require('express'),
	eAdmin = express(),
	eApp = express(),
	ePort = 4848,
	authExpress = module.exports = express(),
	html = require('express-html'),
	session = require('express-session'),
	OAuthServer = require('express-oauth-server'),
	DiscordClient = new Discord.Client(),
	Token = config.Discord.Token,
	clusterHost = config.Cluster.Host,
	clusterPass = config.Cluster.Password,
	clusterKey = config.Cluster.Key,
	privateKey = fs.readFileSync(
	'./ArtemisKey.pem'),
	certificate = fs.readFileSync(
	'./ArtemisCRT.pem'),
	eventEmitter = new events.EventEmitter(),
	cluster = require('cluster'),
	mysql = require('mysql2'),
	poolCluster = mysql.createPoolCluster();
	commandoClient = new Commando.Client({
		owner: '247176974164819968','132273652266827776',
		commandPrefix: '[]',
		disableEveryone: true,
		
	}),
	model = {
		getAccessToken: function() {
			return new Promise('Authenticated!');
		},
		getAuthorizationCode: function(done) {
			done(null, 'Authenticated');
		},
		getClient: function*() {
			yield fs.readFileSync('./Login');
			return 'Authenticated';
		}
	};
    // Libraries and configs

bPromise.promisifyAll([commandoClient, fs, html, session, OAuthServer, bodyParser, tls, express, path]);	


	
//remoteSQL = mysql.createConnection({
//	user: config.clientSQL.Username, 
//	database: 'Master_Discord', 
//	host: config.clientSQL.Host, 
//	pass: config.clientSQL.Pass,
//	port: config.clientSQL.Port
//});


// Later Deployments V
//eApp.oauth = new OAuthServer({
//	model: ('./model')
//});
//eApp.use(bodyParser.json());
//eApp.use(bodyParser.urlencoded({ extended: false }));
//eApp.use(oauth.authorize());

//eApp.use(function(req, res) {
//	res.send('TT');
//});

//oauth.listen(3000);
// Later Deployments ^


var server = mysql.createServer();
server.listen(3306);
server.on('connection', function (conn) {
  console.log('connection');

  conn.serverHandshake({
    protocolVersion: 10,
    serverVersion: 'ToasTec SQL Server',
    connectionId: 1234,
    statusFlags: 2,
    characterSet: 8,
    capabilityFlags: 0xffffff
  });

  conn.on('field_list', function (table, fields) {
    console.log('field list:', table, fields);
    conn.writeEof();
  });

  var remote = mysql.createConnection({user: config.SQL.User, database: config.SQL.Database, host:config.SQL.Host, password: config.SQL.Pass, port: config.SQL.Port});

  conn.on('query', function (sql) {
    console.log('proxying query:' + sql);
    remote.query(sql, function (err) {
      // overloaded args, either (err, result :object)
      // or (err, rows :array, columns :array)
      if (Array.isArray(arguments[1])) {
        // response to a 'select', 'show' or similar
        var rows = arguments[1], columns = arguments[2];
        console.log('rows', rows);
        console.log('columns', columns);
        conn.writeTextResult(rows, columns);
      } else {
        // response to an 'insert', 'update' or 'delete'
        var result = arguments[1];
        console.log('result', result);
        conn.writeOk(result);
      }
    });
  });

  conn.on('end', remote.end.bind(remote));
});


//connect = mysql.createConnection({
//	host: config.clientSQL.Host,
//	user: config.clientSQL.Username,
//	database: 'Master_Discord_Core',
//	port: '37371'
//});

	

//serverSQL.listen(3306);
console.log(commandoClient);
//console.log(serverSQL);
//console.log(remoteSQL);
//console.log(https);

https.createServer({
	key: privateKey,
	cert: certificate
}, eApp).listen(ePort);

eApp.get('/', function(req,res,html) {
	res.sendFile(path.join(__dirname + '/www/index.html'));
});

eApp.get('/Dashboard', function(req,res,html) {
	res.sendFile(path.join(__dirname + '/www/Dashboard/index.html'));
});

eApp.get('/UI', function(req,res,html) {
	res.sendFile(path.join(__dirname + '/www/UI/index.html'));
});

eApp.get('/Audio', function(req,res,html) {
	res.sendFile(path.join(__dirname + '/www/Audio'));
});

eApp.use(express.static('./www'));

commandoClient.on('ready', () => {
	commandoClient.user.setPresence({ game: {name: 'Dual Universe ToasTec', type: 1 } });
});

DiscordClient.on('ready', () => {
	DiscordClient.user.setPresence({ game: {name: 'Dual Universe', type: 1 } });
});

// TBA
//commandoClient.setProvider(db => new RemoteSQL.
// TBA


// Alerts when logged in.
DiscordClient.on('ready', () => {
  console.log(`Logged in as ${DiscordClient.user.tag}!`);
});

commandoClient.on('ready', () => {
  console.log(`Logged in as ${commandoClient.user.tag}!`);
});
// Alerts when logged in.


// Login Bots with Tokens
DiscordClient.login(config.Discord.Token);
commandoClient.login(config.Commando.Token);
// Login Bots with Tokens


// embed
const embed = new Discord.RichEmbed()
	.setTitle("ToasTec Status")
	.setColor("3447003")
	.setDescription("Dual Universe ToasTec, [Dashboard](config.Discord.DashboardUrl) !")
	.setFooter("Click the above link for the dashboard, User authetication required")
	.setTimestamp()
	.addField("This is a test")
	.addField("This is also a test", true)
	.addBlankField(true);
// embed end



// Message Handling for both bots V
DiscordClient.on('message', (message) => {
	if (!message.content.startsWith(config.Discord.prefix)) return;
	if (!message.content.startsWith(config.Discord.prefix) || message.author.bot) return;
	
	if (message.content.startsWith(config.Discord.prefix + "Avatar")) {
	message.channel.send(message.author.avatarURL);
	} else
	if (message.content.startsWith(config.Discord.prefix + "Dashboard")) {
	message.channel.send({embed: {
		title: "ToasTec Status",
		description: "Dual Universe ToasTec, [Dashboard](config.Discord.DashboardUrl) !",
			fields: [{
				name: "Test",
				value: "This is a test"
			},
			{
				name: "Masked links",
				value: "This is a test [ToasTec](config.Discord.DashboardUrl) !"
  }
});
	};
});

console.log(DiscordClient);

commandoClient.on('message', (message) => {
	if (!message.content.startsWith(config.Commando.prefix)) return;
	if (!message.content.startsWith(config.Commando.prefix) || message.author.bot) return;
	if (message.content.startsWith(config.Commando.prefix + "Kill")) {
		commandoClient.destroy();
		DiscordClient.destroy();
		console.log('Discord Killed');
		process.exit();
	} else 
    if (message.content.startsWith(config.Commando.prefix + "SQLPort")) {
		message.channel.send(server);
	}
});
// Message Handling for both bots ^
new Promise(() => { throw new Error('exception!'); });

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
	
	
	
// Match Commands with directory on script
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
// Register and join