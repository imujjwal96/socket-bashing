var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    socket.on('execute', function (data) {
        executeScript(socket);
    });
});

var executeScript = function (socket) {
    var spawn = require('child_process').spawn;
    var process = spawn('sh', [ 'init.sh' ]);
    var donePercent = 0;
    process.stdout.setEncoding('utf-8');
    process.stdout.on('data', function (data) {
        socket.emit('logs', {donePercent: (donePercent = donePercent + 12), data: data});
    });
    process.stderr.setEncoding('utf-8');
    process.stderr.on('data', function (data) {
        socket.emit('err-logs', data);
    });
};
http.listen(3000, function(){
    console.log('listening on *:3000');
});