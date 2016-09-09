var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var path = require('path');
var gameplay = require('./routes/gameplay');

app.use(bodyParser.json());

// Serve back static files
app.use(express.static(path.join(__dirname, './public')));

// Handle index file separately
app.use('/gameplay', gameplay);

app.get('/', function(req, res){
  res.sendFile('/Users/coreypeck/Desktop/Solo Project/solo_project/server/public/views/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(5000, function(){
  console.log('listening on *:5000');
});
