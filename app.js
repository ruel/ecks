/*
 * app.js
 */

// Packages
var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var consolidate = require('consolidate');
var swig = require('swig');
var _ = require('underscore');

var config = require('./config.js');
var xmpp = require('./xmpp.js');

// Vars
var app = express();
var logger = config.logger;
var server = http.createServer(app);
var io = socketio.listen(server);

// Associate socket with xmpp client
var clients = [];
var conns = [];

server.listen(config.get('app:port'));
app.use(express.bodyParser());
app.use(express.logger('dev'));
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler());


// Set view engine
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.engine('.html', consolidate.swig);
swig.init({ root: __dirname + '/views' });

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
                
                // Add client to list
                clients.push(client);
                xmpp.presence(client);
                res.render('loggedin', { jid : client.jid.toString() });
            } else {
                res.send(401);
            }
        });
    } else {
        res.send(400);
    }
});

io.sockets.on('connection', function (socket) {
    socket.on('assoc', function (jid) {
        var client = _.find(clients, function (cl) {
            return cl.jid.toString() === jid;
        });
        
        logger.log(0, 'Associating jid: ' + jid);
        socket.xclient = client;
    });
    
    socket.on('disconnect', function () {
        socket.xclient.connection.end();
    });
});