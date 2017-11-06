// Dependencies
var PORT = 1212
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ttl = 0;

server.listen(PORT, function(){
  console.log('started server on port ' + PORT)
});

app.use('/static', express.static(__dirname + '/static'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
})

var users = {};
var players = {
  1: null,
  2: null,
  3: null,
  4: null
};

io.on('connection', function(socket) {
  users[socket.id] = {
    name: 'Tamu'
  }
  current_user = users[socket.id];
  console.log(socket.id + ' joined')


  socket.on('set name', function(data){
    current_user.name = String(data);
  });

  socket.on('join slot', function(data){
    var slot = parseInt(data);
    var name = current_user.name;
    if( slot > 0 && slot < 5 && players[slot] == null ){
      players[slot] = socket.id;
      console.log(name + ' joined slot ' + slot)
    }
    else{
      console.log(name + ' trying to join invalid slot: ' + slot);
    }
    console.log(players)
  });

  socket.on('disconnect', function(){
    console.log(current_user.name + '(' + socket.id + ') disconnected.');
    delete users[socket.id];
  })
});

setInterval(function() {
  console.log(users);
}, 5000);

