const express = require('express');
const httpProxy = require('express-http-proxy');
const app = express();
const request = require('request-promise-native');
const config = require('../Config/config.json');

const userServiceProxy = httpProxy(config.httpProxy.proxyUrl)

// Authentication

app.user((req, res, next) => {
	// TODO: My auth logic
	next()
})

app.get('/users/:userId', (req, res, next) => {
	userServiceProxy(req, res, next)
})