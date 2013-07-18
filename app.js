/*
 * app.js
 */

// Packages
var express = require('express');
var http = require('http');
var socketio = require('socket.io');

var config = require('./config.js');
var xmpp = require('./xmpp.js');

// Vars
var app = express();
var logger = config.logger;
var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(config.get('app:port'));
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());

// Initial page
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/views/index.html');
});

app.post('/', function (req, res) {
    var jid = req.body.jid;
    var pass = req.body.pass;
    
    if (jid !== undefined && pass !== undefined &&
        jid !== "" && pass != "") {
        xmpp.login(jid, pass, function (err, client) {
            if (client) {
                presence(client);
                res.sendfile(__dirname + '/views/loggedin.html');
            } else {
                res.send(401);
            }
        });
    } else {
        res.send(400);
    }
});

io.sockets.on('connection', function (socket) {
    function presence (client) {
        
        // Send a presence
        client.send(new xmpp.Element('presence', { type: 'available' }).
            c('show').t('chat')
        );
        
        join(client, 'test@twisted.ruel.me');
    }
    
    function join (client, room) {
        
        // Join a the roon
        client.send(new xmpp.Element('presence', room + '/test' }).
            c('x', { xmlns: 'http://jabber.org/protocol/muc' })
        );
    }
});