$(document).on('ready', function() {
    var http = location.protocol;
    var slashes = http.concat("//");
    var host = slashes.concat(window.location.host);
    
    var socket = io.connect(host);
});