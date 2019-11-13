const dualShock = require('dualshock-controller'),
    express = require("express"),
    // app = express(),
    http = require("http").createServer(),
    io = require("socket.io")(http),
    SerialPort = require('serialport'),
    Readline = require('@serialport/parser-readline'),
    parser = new Readline(),
    port = new SerialPort("/dev/cu.SLAB_USBtoUART", {
        baudRate: 9600
    })

port.pipe(parser)

parser.on('data', line => {
    io.sockets.emit('rf', line)
    console.log(`> ${line}`)
})


try {
    var controller = {} //dualShock({
    //     config: "dualshock4-generic-driver",
    //     accelerometerSmoothing: true,
    //     analogStickSmoothing: false
    // });

    controller.on('connected', () => console.log('connected'));
    controller.on('error', () => console.log('poep'));
    controller.on('data', data => console.log('yeet' + data));

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
    controller.on('x:press', () => {
        console.log(1)
        port.write('1')
        io.sockets.emit('x', 'press')
    }); //io.sockets.emit('x', 'press'));
    controller.on('x:release', () => {
        console.log(2)
        port.write('2')
        io.sockets.emit('x', 'release')
    }); //io.sockets.emit('x', 'release'));
    controller.on('touchpad:x1:active', () => io.sockets.emit('touchpad one finger active'));
    controller.on('touchpad:x2:active', () => io.sockets.emit('touchpad two fingers active'));
    controller.on('touchpad:x2:inactive', () => io.sockets.emit('touchpad back to single finger'));
    controller.on('touchpad:x1', data => io.sockets.emit('touchpad', JSON.stringify({
        f: 1,
        x: data.x,
        y: data.y
    })));
    controller.on('touchpad:x2', data => io.sockets.emit('touchpad', JSON.stringify({
        f: 2,
        x: data.x,
        y: data.y
    })));
    controller.on('rightLeft:motion', data => io.sockets.emit(data));
    controller.on('forwardBackward:motion', data => io.sockets.emit(data));
    controller.on('upDown:motion', data => io.sockets.emit(data));
} catch (e) {
    if (e.toString() == "Error: device with VID:0x054c PID:0x09cc not found")
        console.error("Please connect a DuelShock4 controller."),
        process.exit(0)
    else console.error(e)
}

io.on("connection", (socket) => {
    io.sockets.emit(`${socket.id} connected!`)
    socket.on('command', function (data) {
        port.write(data)
        io.sockets.emit('command', data)
        console.log(data);
    });
});

http.listen(3000, () => {
    console.log("Server Is Running Port: " + 3000);
});