$(document).on('ready', function() {
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.host);
    
    var socket = io.connect(host);
    
    socket.emit('assoc', $('#jid').val());
    
    socket.on('online', function(nick) {
        var i = $('<li id="on' + nick + '">' + nick + '</li>').hide().fadeIn(1000);
        $('#online').append(i);
    });
    
    socket.on('offline', function(nick) {
        $('#on' + nick).fadeOut(1000);
    });
});