/*
 * xmpp.js
 */

var xmpp = require('node-xmpp');
var config = require('./config.js');

var logger = config.logger;

// Check if login, and.. login
exports.login = function (jid, password, callback) {
    
    // Get initial host and port, and append the params
    var xinfo = config.get('xmpp');
    xinfo.jid = jid;
    xinfo.password = password;
    
    // Try to login
    var client = new xmpp.Client(xinfo);
    
    client.once('online', function () {
        callback(null, client);
    });
    
    // Below means, not logged in
    client.once('error', function () {
        callback(new Error('Invalid Login'), null);
    });
    
    client.connection.once('error', function () {
        callback(new Error('Invalid Login'), null);
    });
    
    client.connection.once('end', function () {
        callback(new Error('Invalid Login'), null);
    });
};