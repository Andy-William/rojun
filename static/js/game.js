// var socket = io();
// socket.on('message', function(data) {
//   console.log(data);
// });




// var movement = {
//   up: false,
//   down: false,
//   left: false,
//   right: false
// }
// document.addEventListener('keydown', function(event) {
//   switch (event.keyCode) {
//     case 65: // A
//       movement.left = true;
//       break;
//     case 87: // W
//       movement.up = true;
//       break;
//     case 68: // D
//       movement.right = true;
//       break;
//     case 83: // S
//       movement.down = true;
//       break;
//   }
// });
// document.addEventListener('keyup', function(event) {
//   switch (event.keyCode) {
//     case 65: // A
//       movement.left = false;
//       break;
//     case 87: // W
//       movement.up = false;
//       break;
//     case 68: // D
//       movement.right = false;
//       break;
//     case 83: // S
//       movement.down = false;
//       break;
//   }
// });
// socket.emit('new player');
// setInterval(function() {
//   socket.emit('movement', movement);
// }, 1000 / 60);

(function RojunIIFE(window, Vue) {
  document.addEventListener("DOMContentLoaded", function(event) {
    console.log('lalala')
    window.Rojun = new Vue({
      el: '#vm__rojun',
      data: {
        types: ['clubs', 'diamonds', 'hearts',],
        cards: ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'j', 'q', 'k', 'a',],
        socket: io(),
        showForm: true,
        name: '',
        flipCard: false,
        joinnedSlot: false,
      },
      methods: {
        toggleCard() {
          this.flipCard = !this.flipCard;
        },
        join() {
          this.socket.emit('set name', this.name);
          this.showForm = false;
        },
        joinSlot() {
          this.socket.emit('join slot', 1);
        }
      },
      mounted() {
        console.log(this.socket)
      }
    });

  });
}(window, Vue));
