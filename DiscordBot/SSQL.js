const url = require('url');
const net = require('net');
const Probe = require('pmx').probe();
const tls = require('tls');
const events = require('events');
const fs = require('fs');
const formidable = require('formidable');
const mysql = require('mysql2');
const poolCluster = mysql.createPoolCluster();
const config = require('./config.json');

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

