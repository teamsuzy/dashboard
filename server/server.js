const dualShock = require('dualshock-controller'),
    express = require("express"),
    // app = express(),
    http = require("http").createServer(),
    io = require("socket.io")(http),
    fs = require('fs'),
    json2xls = require('json2xls'),
    SerialPort = require('serialport'),
    Readline = require('@serialport/parser-readline'),
    parser = new Readline(),
    port = new SerialPort("/dev/tty.SLAB_USBtoUART", {
        baudRate: 9600
    }),
    dataChunk = []

port.pipe(parser)

parser.on('data', line => {
    io.sockets.emit('rf', line)
    console.log(`> ${line}`)
    try {
        line = JSON.parse(line)
        if ('alive' in line && 'temperature' in line && 'altitude' in line && 'pressure' in line && 'gps' in line && line['gps']) {
            line["time"] = new Date().toISOString()
            dataChunk.push(line)
        }
    } catch (e) {}
})


try {
    var controller = {}
    var controller = dualShock({
        config: "dualshock4-generic-driver",
        accelerometerSmoothing: true,
        analogStickSmoothing: false
    });

    var xpressed = false

    controller.on('connected', () => console.log('connected'));
    controller.on('error', () => console.log('controller error'));
    controller.on('data', data => console.log('yeet' + data));

    // controller.on('left:move', data => console.log('left Moved: ' + data.x + ' | ' + data.y));
    // controller.on('left:move', data => io.sockets.emit('left', JSON.stringify({
    //     x: data.x,
    //     y: data.y
    // })));
    let lastx = 0;
    controller.on('right:move', data => {
        var x = ((data.x / 255) * 1800) > 1790 ? 1790 : Math.round(((data.x / 255) * 1800))
        if (difference(lastx, (x / 10)) > 5) {
            console.log(parseInt(((x) / 10) + ''))
            port.write(parseInt(((x) / 10) + '') + '\n')
            lastx = parseInt(((x) / 10) + '')
        }
        io.sockets.emit('right', JSON.stringify({
            x: data.x,
            y: data.y
        }))
    });
    controller.on('square:press', () => io.sockets.emit('square', 'press'));
    controller.on('square:release', () => io.sockets.emit('square', 'release'));
    controller.on('triangle:press', () => io.sockets.emit('triangle', 'press'));
    controller.on('triangle:release', () => io.sockets.emit('triangle', 'release'));
    controller.on('circle:press', () => io.sockets.emit('circle', 'press'));
    controller.on('circle:release', () => io.sockets.emit('circle', 'release'));
    controller.on('x:press', () => {
        xpressed = true
        // console.log(1)
        // var xinterval = setInterval(function () {
        // if (!xpressed) console.log("no"), clearInterval(xinterval)
        port.write('179\n')
        // console.log("yes")
        // }, 500)
        // io.sockets.emit('x', 'press')
    }); //io.sockets.emit('x', 'press'));
    controller.on('x:release', () => {
        xpressed = false
        // console.log(2)
        port.write('1\n')
        // io.sockets.emit('x', 'release')
    }); //io.sockets.emit('x', 'release'));
    controller.on('touchpad:x1:active', () => io.sockets.emit('touchpad one finger active'));
    controller.on('touchpad:x2:active', () => io.sockets.emit('touchpad two fingers active'));
    controller.on('touchpad:x2:inactive', () => io.sockets.emit('touchpad back to single finger'));
    controller.on('touchpad:x1', data => {
        io.sockets.emit('touchpad', JSON.stringify({
            f: 1,
            x: data.x,
            y: data.y
        }))
        var x = data.x > 1790 ? 1790 : Math.round(data.x)
        if (difference(lastx, (x / 10)) > 5) {
            console.log(parseInt(((x) / 10) + ''))
            port.write(parseInt(((x) / 10) + '') + '\n')
            lastx = parseInt(((x) / 10) + '')
        }
    });
    controller.on('touchpad:x2', data => {
        io.sockets.emit('touchpad', JSON.stringify({
            f: 2,
            x: data.x,
            y: data.y
        }))
    });
    controller.on('rightLeft:motion', data => io.sockets.emit(data));
    controller.on('forwardBackward:motion', data => io.sockets.emit(data));
    controller.on('upDown:motion', data => io.sockets.emit(data));
} catch (e) {
    if (e.toString() == "Error: device with VID:0x054c PID:0x09cc not found")
        console.error("Please connect a DuelShock4 controller.") //,
    // process.exit(0)
    else console.error(e)
}

io.on("connection", (socket) => {
    io.sockets.emit(`${socket.id} connected!`)
    console.log(`${socket.id} connected!`)
    socket.on('command', function (data) {
        port.write(data + '\n')
        io.sockets.emit('command', data)
        console.log(data);
    });

    socket.on('save', () => {
        // io.sockets.emit('command', data)
        console.log(dataChunk.length);
        if (dataChunk.length) {
            var xls = json2xls(dataChunk);
            var path = `../docs/data/data-${dataChunk[dataChunk.length-1]["alive"]}.xlsx`
            fs.writeFileSync(path, xls, 'binary');
            socket.emit("savePath", path.substr(7))
        } else socket.emit("savePath", false)
    });
});

http.listen(3000, () => {
    console.log("Server Is Running Port: " + 3000);
});

var difference = function (a, b) {
    return Math.abs(a - b);
}