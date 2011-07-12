var Settings    = require(__dirname + '/config/settings')(__dirname);
var Server      = require(__dirname + '/server');

process.on('unhandledException', function(err) {
    console.log('unhandledException Exception');
    console.log(err);
});

process.on('uncaughtException', function(err) {
    console.log('uncaughtException Exception');
    console.log(err);
});



server = new Server(__dirname, Settings);
server.start();