console.log('x');
var socket = io();
socket.emit('message', 'hi');
socket.on('visitor enters', function(msg){
	console.log(msg);

	$('#visitors').text (`current visitors: ${msg}`);

});