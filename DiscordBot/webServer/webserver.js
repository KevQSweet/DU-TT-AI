const config = require('../Config/config.json'); // Grab Main config file
const Probe = require('pmx').probe(); // Connect to Keymetrics
const Discord = require('discord.js'); // Grab Discord.js library
const DClient = new Discord.Client(); // DClient = Discord Client then create new client
const DHook = new Discord.WebhookClient(config.Endpoint.HookID,config.Endpoint.HookToken); // Login Discord Webhook (DHOOK) for sending a output to Discord
const util = require('util');
const weak = require('weak');
const dnode = require('dnode')();
const nQuery = require('nquery');
const fs = require('fs'); // File System
const https = require('https'); // Grab the library for making SSL based Servers
const path = require('path');
const events = require('events');
const mysql = require('mysql');
const tls = require('tls'); // Grab library for Transport Layer Security
const express = require('express'); // Grab Library for Express, Express is a webserver
const html = require('express-html'); // Grab Library addon for Express to enable Express to read .html files
const session = require('express-session'); // Create Sessions for connections in Express
const php = require('express-php'); // Allow the use of PHP pages and scripts in a express environment
const async = require('async');
const net = require('net');
const pmx = require('pmx'); // Require the Pmx monitoring system
const authExpress = module.exports = express(); // Export Auth for other scripts
const bodyParser = require('body-parser');
const dns = require('dns'); // Lookup Domain name servers (Domain names)
const eApp = express(); // eApp = ExpressApp so we are creating a new express app with the const of eApp
const ePort = 4848; // Specifying port to listen for traffic on
const eAdmin = express(); // Administration control
const privateKey = fs.readFileSync('../Certificates/ArtemisKey.pem'); // Getting SSL Certificates for Webserver
const certificate = fs.readFileSync('../Certificates/ArtemisCRT.pem'); // Getting SSL Certificates for Webserver
const eventEmitter = new events.EventEmitter();
const connection = mysql.createConnection({
	host: config.SQL.NodeSQL.host,
	user: config.SQL.NodeSQL.user,
	port: config.SQL.NodeSQL.port,
	password: config.SQL.NodeSQL.password,
	database: config.SQL.NodeSQL.database
}); // Connect to Database server

https.createServer({
	key: privateKey,
	cert: certificate
}, eApp).listen(ePort); // Create a https server with ssl certificate's and then listen on 4848

// Register paths for server to listen on think of it like htdocs for apache anything that's in that folder will be directed where it needs to be.
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

eApp.get('/Dual', function(req,res,html) {
	res.sendFile(path.join(__dirname + '/www/Dual'));
});

eApp.get('/Artemis', function(req,res,html) {
	res.sendFile(path.join(__dirname + '/www/Artemis/index.html'));
});
// end of paths

// ignore this
// Mount Dash 2
eApp.use(php.cgi('./htdocs'));
eApp.use(express.static('./htdocs'));
// Mount Dash 2
eApp.use(express.static('./Scope'));
// ignore this

//
// Get data then output to html page


// Mount Bind 

eApp.use('/Web/Dash/admin', eAdmin);

eApp.use('/', express.static(path.join('./www', './www')));
eApp.use("./www/Dashboard", express.static(path.join('./www/Dashboard', './www/Dashboard')));

eApp.use('/Web/Dash/Artemis', express.static('Artemis'));

eApp.use(express.static('./www'));
// Mount Bind End

// When a user visits a page that isn't there we should throw them out of the nearest airlock. Not that silly 404 page..
eApp.use(function (req, res, next) {
	res.status(404).send("Error page not found, To Fix please head to nearest airlock!")
});
// Error 404

// Trying to inject into Discord embed to a webhook
//const EndpointEmbed = new Discord.RichEmbed()
//	.setTitle("Endpoint Server Status")
//	.setColor(3710706)
//	.setDescription("Endpoint Online")
//	.addField("Current Status", "Server is Online")
//	.setFooter("Endpoint Server Status")
//DHook.send({EndpointEmbed});
// Doesn't seem to send