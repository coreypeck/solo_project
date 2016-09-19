var express = require("express");
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(http);
var bodyParser = require('body-parser');
var path = require('path');

var passport = require('./strategies/user_sql.js');
var session = require('express-session');

var index = require('./routes/index');
var user = require('./routes/user');
var register = require('./routes/register');
var gameplay = require('./routes/gameplay');

app.use(bodyParser.json());

// Serve back static files
app.use(express.static(path.join(__dirname, './public')));

app.use(session({
   secret: 'secret',
   key: 'user',
   resave: 'true',
   saveUninitialized: false,
   cookie: {maxage: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/register', register);
app.use('/user', user);
app.use('/gameplay', gameplay);
app.use('/*', index);

app.get('/', function(req, res){
  res.sendFile('/Users/coreypeck/Desktop/Solo Project/solo_project/server/public/views/index.html');
});

io.sockets.on('connection', function(socket){
  console.log("io connection running");
  socket.on('chat message', function(data){
    console.log(data);
    io.emit('chat message', data);
  });
  socket.on('event', function(data){
    console.log(data);
    io.emit('event', data);
  });
  socket.on('building', function(data){
    console.log(data);
    io.emit('building', data);
  });
  socket.on('vote reset', function(data){
    console.log(data);
    io.emit('vote reset', data);
  });
});

function sessionCleanup() {
    sessionStore.all(function(err, sessions) {
        for (var i = 0; i < sessions.length; i++) {
            sessionStore.get(sessions[i], function() {} );
        }
    });
}

setInterval(sessionCleanup, 5000);

server.listen(process.env.PORT || 5000);
