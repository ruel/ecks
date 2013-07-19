$(document).on('ready', function() {
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.host);
    
    var socket = io.connect(host);
    
    socket.emit('assoc', $('#jid').val());
    
    socket.on('online', function(nicks) {
        $('#online').empty();
        $.each(nicks, function() {
            $('#online').append('<li id="on' + this + '">' + this + '</li>');
        });
       
    });
    
    socket.on('stanza', function(stanza) {
        console.log(stanza);
        $('#stanzas').append('<div class="stanza" class="' + stanza.type + '">' + stanza.text + '</div>');
    });
});