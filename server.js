// Dependencies
var PORT = 1212
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var ttl = 0;

var seven = require('./seven');
var game = null;

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
  var current_user = users[socket.id]
  var current_slot = 0
  console.log(socket.id + ' joined')

  socket.on('set name', function(data){
    current_user.name = String(data)
  })

  socket.on('join slot', function(data){
    if( current_slot != 0 ){
      socket.emit('message', 'gaboleh join banyak slot')
      return
    }

    var slot = parseInt(data);
    var name = current_user.name;
    if( slot > 0 && slot < 5 && players[slot] == null ){
      players[slot] = socket.id;
      current_slot = slot;
      console.log(name + ' joined slot ' + slot)
    }
    else{
      console.log(name + ' trying to join invalid slot: ' + slot);
    }
    console.log(players)
  });

  socket.on('disconnect', function(){
    console.log(current_user.name + '(' + socket.id + ') disconnected.');
    players[current_slot] = null;
    delete users[socket.id];
  })

  socket.on('ready', function(){
    if( players[current_slot] == socket.id ){
      current_user.ready = true;
      for( var i=1 ; i<=4 ; i++ ){
        console.log(players[i]);
        if( players[i]) console.log(users[players[i]].ready);
        if( players[i] && users[players[i]].ready ) continue;
        else return;
      }
      console.log('semua siap');
      io.socket.broadcast.emit('start game');
      io.socket.emit('message', 'starto');
    }
    else{
      socket.emit('message', 'join slot dulu woi');
    }

  })
});

setInterval(function() {
  console.log(users);
}, 5000);

