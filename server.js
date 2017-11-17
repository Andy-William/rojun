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
    newName = String(data)
    console.log(current_user.name + '(' + socket.id + ') changed name to ' + newName)
    current_user.name = newName
  })

  socket.on('disconnect', function(){
    console.log(current_user.name + '(' + socket.id + ') disconnected.');
    if( current_slot>0 ) io.sockets.emit('leave slot', current_slot);
    players[current_slot] = null;
    delete users[socket.id];
  })

  socket.on('join slot', function(data){
    console.log(current_user.name + '(' + socket.id + ') trying to join slot ' + String(data));
    if( current_slot != 0 ){
      socket.emit('invalid', 'Cuma boleh join 1 slot')
      return
    }

    var slot = parseInt(data);
    var name = current_user.name;
    if( slot > 0 && slot < 5 && players[slot] == null ){
      players[slot] = current_user;
      current_slot = slot;
      io.sockets.emit('join slot', {slot: current_slot, name: name, id: socket.id});
    }
    else{
      io.sockets.emit('invalid', 'slot invalid')
    }
    console.log('players: ' + JSON.stringify(players))
  });

  socket.on('ready', function(){
    console.log(current_user.name + '(' + socket.id + ') trying to ready slot ' + current_slot);
    if( current_user.ready ) return;
    if( players[current_slot] == users[socket.id] ){
      console.log(current_user.name + '(' + socket.id + ') ready (slot ' + current_slot + ')');
      current_user.ready = true;
      for( var i=1 ; i<=4 ; i++ ){
        if( players[i] && players[i].ready ) continue;
        else return;
      }
      console.log('semua siap');
      io.sockets.emit('start game');
    }
    else{
      socket.emit('invalid', 'join slot dulu woi');
    }
  })
});

setInterval(function() {
  console.log(users);
}, 5000);

