const dualShock = require('dualshock-controller'),
    express = require("express"),
    app = express(),
    port = 3000,
    http = require("http").createServer(),
    io = require("socket.io")(http)

var controller = dualShock({
    config: "dualshock4-generic-driver",
    accelerometerSmoothing: true,
    analogStickSmoothing: false
});

io.on("connection", (socket) => {});

controller.on('connected', () => console.log('connected'));

// controller.on('left:move', data => console.log('left Moved: ' + data.x + ' | ' + data.y));
// controller.on('left:move', data => io.sockets.emit('left', JSON.stringify({
//     x: data.x,
//     y: data.y
// })));
controller.on('right:move', data => io.sockets.emit('right', JSON.stringify({
    x: data.x,
    y: data.y
})));
controller.on('square:press', () => io.sockets.emit('square', 'press'));
controller.on('square:release', () => io.sockets.emit('square', 'release'));
controller.on('triangle:press', () => io.sockets.emit('triangle', 'press'));
controller.on('triangle:release', () => io.sockets.emit('triangle', 'release'));
controller.on('circle:press', () => io.sockets.emit('circle', 'press'));
controller.on('circle:release', () => io.sockets.emit('circle', 'release'));
controller.on('x:press', () => io.sockets.emit('x', 'press'));
controller.on('x:release', () => io.sockets.emit('x', 'release'));
// controller.on('touchpad:x1:active', () => io.sockets.emit('touchpad one finger active'));
// controller.on('touchpad:x2:active', () => io.sockets.emit('touchpad two fingers active'));
// controller.on('touchpad:x2:inactive', () => io.sockets.emit('touchpad back to single finger'));
// controller.on('touchpad:x1', data => io.sockets.emit('touchpad x1:', data.x, data.y));
// controller.on('touchpad:x2', data => io.sockets.emit('touchpad x2:', data.x, data.y));
controller.on('rightLeft:motion', data => io.sockets.emit(data));
controller.on('forwardBackward:motion', data => io.sockets.emit(data));
controller.on('upDown:motion', data => io.sockets.emit(data));

http.listen(port, () => {
    console.log("Server Is Running Port: " + port);
});