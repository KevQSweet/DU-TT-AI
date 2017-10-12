'use strict'

let https = require('https');
let fs = require('fs');

function getPostDataAndDo(req, callback) {
	var content = ''
	
	function onData(data) {
		content += data;
	}
	function onEnd() {
		callback(content);
	}
	
	req.on('data', onData);
	req.on('end', onEnd);
}

function getJSONDataAndDo(req, res, callback) {
	function parseAndCallback(content) {
		var parsed = {};
		try {
			parsed = JSON.parse(content);
		}
		catch (e) {
			res.writeHead(400, { 'Content-Type': 'text/html;charset=utf-8' });
			res.end(e.name + ': ' + e.message);
			return;
		}
		callback(parsed);
	}
	getPostDataAndDo(req, parseAndCallback);
}

function replyWithError(res, err, httpCode) {
    if (httpCode) {
        res.writeHead(httpCode, { 'Content-Type': 'text/html;charset=utf-8' });
    }
    else if ('invalidArgument' in err) {
        res.writeHead(400, { 'Content-Type': 'text/html;charset=utf-8' });
    }
    else {
        res.writeHead(500, { 'Content-Type': 'text/html;charset=utf-8' });
    }
    res.end(err.name + ': ' + err.message);
}


function CallbackToPromise(resolve, reject) {
    return function (error, data) {
        if (error) {
            reject(error);
        }
        else {
            resolve(data);
        }
    }
};

function NativeCallbackToPromise(resolve, reject) {
    return function (error, data) {
        //
        // HACK: for some reasons node may delay resolving promises and calling .then
        // until next tick when reject or resolve is called from native addon.
        // This setImmediate forces execution to be continued in next tick.
        //
        if (error) {
            setImmediate((function () { reject(error); }));
        }
        else {
            setImmediate((function () { resolve(data); }));
        }
    }
};


function RegisterExpressEndpoints(app, api, logger, httpServer) {
	f
}

