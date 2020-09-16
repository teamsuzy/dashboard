class PlaceholderPort {
  write() { }
}
// const dualShock = require("dualshock-controller"),
// const express = require("express"),
//   app = express(),
const http = require("http").createServer(),
  io = require("socket.io")(http),
  fs = require("fs"),
  json2xls = require("json2xls"),
  SerialPort = require("serialport"),
  Readline = require("@serialport/parser-readline"),
  parser = new Readline();

let dataChunk = [],
  port = new PlaceholderPort();

SerialPort.list().then(ports => {
  if (!ports.find(port => port.path == "/dev/tty.SLAB_USBtoUART"))
    console.error("[SERIAL]    ", "Please connect the serial RF dongle."),
      io.sockets.emit("[SERIAL]    ", "Please connect the serial RF dongle.");
  else
    (port = new SerialPort("/dev/tty.SLAB_USBtoUART", { baudRate: 9600 })),
      port.pipe(parser);
});

parser.on("data", line => {
  console.error("[SERIAL] <= ", line);
  io.sockets.emit("[SERIAL] <= ", line);
  try {
    line = JSON.parse(line);
    if (
      "alive" in line &&
      "temperature" in line &&
      "altitude" in line &&
      "pressure" in line &&
      "gps" in line
    ) {
      line["time"] = new Date().toISOString();
      dataChunk.push(line);
      var path = `../docs/data/json-autosave/data-${
        dataChunk[dataChunk.length - 1]["alive"]
        }.json`;
      fs.writeFileSync(path, JSON.stringify(dataChunk));
    }
  } catch (e) { }
});

try {
  var controller = {};
  var controller = dualShock({
    config: "dualshock4-generic-driver",
    accelerometerSmoothing: true,
    analogStickSmoothing: false
  });

  controller.on("connected", () => {
    controller.setExtras({
      rumbleLeft: 0, // 0-1 (Rumble left on/off)
      rumbleRight: 255, // 0-255 (Rumble right intensity)
      led: 2 // 2 | 4 | 8 | 16 (Leds 1-4 on/off, bitmasked)
    });
  });
  controller.on("error", () => console.log("controller error"));
  controller.on("data", data => console.log("yeet" + data));

  // controller.on('left:move', data => console.log('left Moved: ' + data.x + ' |
  // ' + data.y)); controller.on('left:move', data => io.sockets.emit('left',
  // JSON.stringify({     x: data.x,     y: data.y })));
  let lasty = 0;
  controller.on("left:move", data => {
    var x =
      (data.x / 255) * 1800 > 1790 ? 1790 : Math.round((data.x / 255) * 1800);
    if (difference(lasty, x / 10) > 5) {
      port.write(`l:${parseInt(x / 10 + "")}F`);
      console.log("[SERIAL] => ", `l:${parseInt(x / 10 + "")}F`);
      lasty = parseInt(x / 10 + "");
      io.sockets.emit("[SERIAL] => ", `r:${parseInt(x / 10 + "")}F`);
      // io.sockets.emit(   "left",   JSON.stringify({     x: data.x,     y: data.y
      // }) );
    }
  });
  let lastx = 0;
  controller.on("right:move", data => {
    var x =
      (data.x / 255) * 1800 > 1790 ? 1790 : Math.round((data.x / 255) * 1800);
    if (difference(lastx, x / 10) > 5) {
      // console.log(parseInt(((x) / 10) + ''))
      port.write(`r:${parseInt(x / 10 + "")}F`);
      console.log("[SERIAL] => ", `r:${parseInt(x / 10 + "")}F`);
      lastx = parseInt(x / 10 + "");
      io.sockets.emit("[SERIAL] => ", `r:${parseInt(x / 10 + "")}F`);
      // io.sockets.emit(   "right",   JSON.stringify({     x: data.x,     y: data.y
      // }) );
    }
  });
  controller.on("square:press", () => io.sockets.emit("square", true));
  controller.on("square:release", () => io.sockets.emit("square", false));
  controller.on("triangle:press", () => io.sockets.emit("triangle", true));
  controller.on("triangle:release", () => io.sockets.emit("triangle", false));
  controller.on("circle:press", () => io.sockets.emit("circle", true));
  controller.on("circle:release", () => io.sockets.emit("circle", false));
  controller.on("x:press", () => io.sockets.emit("circle", true));
  controller.on("x:release", () => io.sockets.emit("circle", false));
  controller.on("touchpad:x1:active", () =>
    io.sockets.emit("touchpad one finger active")
  );
  controller.on("touchpad:x2:active", () =>
    io.sockets.emit("touchpad two fingers active")
  );
  controller.on("touchpad:x2:inactive", () =>
    io.sockets.emit("touchpad back to single finger")
  );
  controller.on("touchpad:x1", data => {
    io.sockets.emit("touchpad", JSON.stringify({ f: 1, x: data.x, y: data.y }));
  });
  controller.on("touchpad:x2", data => {
    io.sockets.emit("touchpad", JSON.stringify({ f: 2, x: data.x, y: data.y }));
  });
  controller.on("rightLeft:motion", data => io.sockets.emit(data));
  controller.on("forwardBackward:motion", data => io.sockets.emit(data));
  controller.on("upDown:motion", data => io.sockets.emit(data));
} catch (e) {
  if (e.toString() == "Error: device with VID:0x054c PID:0x09cc not found" || e.toString() == "ReferenceError: dualShock is not defined")
    console.error("[CONTROLLER]", "Please connect a DuelShock4 controller."),
      io.sockets.emit(
        "[CONTROLLER]",
        "Please connect a DuelShock4 controller."
      );
  else console.error(e), io.sockets.emit("[ERROR]    ", e);
}

io.on("connection", socket => {
  io.sockets.emit("[SOCKETS]   ", `Socket ${socket.id} connected!`);
  console.log("[SOCKETS]   ", `Socket ${socket.id} connected!`);

  socket.on("command", function (data) {
    port.write(data + "\n");
    io.sockets.emit("[SOCKETS]   ", data);
    console.log("[SOCKETS]   ", data);
  });

  socket.on("save", () => {
    // io.sockets.emit('command', data)
    if (dataChunk.length) {
      var xls = json2xls(dataChunk);
      var path = `../docs/data/data-${
        dataChunk[dataChunk.length - 1]["alive"]
        }.xlsx`;
      fs.writeFileSync(path, xls, "binary");
      socket.emit("savePath", path.substr(7));
    } else socket.emit("savePath", false);
  });

  let input;
  socket.on("input", data => {
    if (Object.values(data)[0] == "r") {
      port.write(
        `${Object.keys(data)[0]}:${Object.values(data)[0] ? 1 : 179}F`
      );
      console.log(
        "[SERIAL] => ",
        `${Object.keys(data)[0]}:${Object.values(data)[0] ? 1 : 179}F`
      );
      io.sockets.emit(
        "[SERIAL] => ",
        `${Object.keys(data)[0]}:${Object.values(data)[0] ? 1 : 179}F`
      );
    } else {
      port.write(
        `${Object.keys(data)[0]}:${Object.values(data)[0] ? 179 : 1}F`
      );
      console.log(
        "[SERIAL] => ",
        `${Object.keys(data)[0]}:${Object.values(data)[0] ? 179 : 1}F`
      );
      io.sockets.emit(
        "[SERIAL] => ",
        `${Object.keys(data)[0]}:${Object.values(data)[0] ? 179 : 1}F`
      );
    }
  });
});

http.listen(3000, () => {
  console.log("[SOCKETS]   ", "Server running at port 3000");
});

var difference = function (a, b) {
  return Math.abs(a - b);
};
