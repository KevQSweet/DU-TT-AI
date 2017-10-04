const config = require('./config.json');
const Probe = require('pmx').probe();
const Discord = require('discord.js');
const DClient = new Discord.Client();
const DHook = new Discord.WebhookClient(config.Endpoint.HookID,config.Endpoint.HookToken);
const util = require('util');
const fs = require('fs');
const https = require('https');
const path = require('path');
const events = require('events');
const tls = require('tls');
const express = require('express');
const html = require('express-html');
const session = require('express-session');
const php = require('express-php');
const async = require('async');
const net = require('net');
const pmx = require('pmx');
const authExpress = module.exports = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const eApp = express();
const ePort = 4848;
const eAdmin = express();
const privateKey = fs.readFileSync('./ArtemisKey.pem');
const certificate = fs.readFileSync('./ArtemisCRT.pem');
const eventEmitter = new events.EventEmitter();

https.createServer({
	key: privateKey,
	cert: certificate
}, eApp).listen(ePort);

// Add paths to Server
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

// end of paths

// Mount Dash 2
eApp.use(php.cgi('./htdocs'));
eApp.use(express.static('./htdocs'));
// Mount Dash 2

// Mount Bind 

eApp.use('/Web/Dash/admin', eAdmin);

eApp.use('/', express.static(path.join('./www', './www')));
eApp.use("./www/Dashboard", express.static(path.join('./www/Dashboard', './www/Dashboard')));

eApp.use('/Web/Dash/Artemis', express.static('Artemis'));

eApp.use(express.static('./www'));
// Mount Bind End

// Error 404
eApp.use(function (req, res, next) {
	res.status(404).send("Error page not found, To Fix please head to nearest airlock!")
});
// Error 404
const EndpointEmbed = new Discord.RichEmbed()
	.setTitle("Endpoint Server Status")
	.setColor(3710706)
	.setDescription("Endpoint Online")
	.addField("Current Status", "Server is Online")
	.setFooter("Endpoint Server Status")
DHook.send({EndpointEmbed});