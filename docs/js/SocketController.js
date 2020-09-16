// const io = require("socket.io-client");
var url_string = window.location.href;
var url = new URL(url_string);
var c = url.searchParams.get("local");
let socket = io(`http://${c ? "localhost" : window.location.hostname}:3000`);

var onevent = socket.onevent;
socket.onevent = function(packet) {
  var args = packet.data || [];
  onevent.call(this, packet); // original call
  packet.data = ["*"].concat(args);
  onevent.call(this, packet); // additional call to catch-all
};

socket.on("*", (event, data) => {
  if ($(`#console`).children().length > 1000) $(`#console`).empty();
  $(`#console`).append(
    `${event.toString().trim()}: ${
      typeof data == "string" && data.isJSON()
        ? library.json
            .prettyPrint(JSON.parse(data.toString().trim()))
            .replace(/\n/g, "")
            .replace(/   /g, " ")
        : typeof data == "boolean"
        ? library.json.prettyPrint(data).replace(/   /g, " ")
        : data.toString()
    }\n`
  );
  var pos = $(`#console`).scrollTop();
  $(`#console`).scrollTop(pos + 999999999);
  // $("#data").html(data && data.isJSON() ? library.json.prettyPrint(JSON.parse(data.toString().trim())) : '')
});

socket.on("[SERIAL] <= ", data => {
  if (!data.isJSON()) return;
  data = JSON.parse(data);
  for (var key in data) {
    if (key == "alive") continue;
    $(`#general-${key}`).text(key == "wait" ? milli(data[key]) : data[key]);
    if (key != "alive" && key != "team" && window[key + "Chart"]) {
      window[key + "Chart"].config.data.datasets[0].data.push({
        x: Date.now(),
        y: data[key]
      });
      window[key + "Chart"].update({
        preservation: true
      });
      if (key == "temperature" && window.myChart) {
        window.myChart.config.data.datasets[0].data.push({
          x: Date.now(),
          y: data[key]
        });
        window.myChart.update({
          preservation: true
        });
      }
    }
    if (key == "gps") {
      if (data[key] && window.mapLoaded) {
        map.getSource("cansat").setData({
          geometry: {
            type: "Point",
            coordinates: [data[key]["long"] / 100, data[key]["lat"] / 100]
          },
          type: "Feature",
          properties: {}
        });
        $(".map-overlay").hide();
        map.flyTo({
          center: [data[key]["long"] / 100, data[key]["lat"] / 100]
        });
      } else {
        $(".map-overlay").show();
      }
    }
  }
  // var d = new Date()
  // $(`#general-time`).text(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}:${d.getMilliseconds()}`)
});

socket.on("savePath", data => {
  if (!data) viewController.toast("No data available...", 1000, "warning");
  $("#download_frame").attr(
    "src",
    `http://${(c ? "localhost:5501/docs" : window.location.hostname) + data}`
  );
});

$("#command").keyup(event => {
  if (event.keyCode === 13 && $("#command").val() != "") {
    $("#command_send").click();
  }
});

$("#command_send").click(() => {
  socket.emit("command", $("#command").val());
  $("#command").val("");
});

function saveData() {
  socket.emit("save", true);
}

const milli = millis => {
  const seconds = ((millis % 60000) / 1000).toFixed(0),
    hours = Math.floor((millis / (1000 * 60 * 60)) % 24),
    minutes = Math.floor(millis / 60000) - 60 * hours;
  return `${hours > 9 ? "" + hours : "0" + hours}:${
    minutes > 9 ? "" + minutes : "0" + minutes
  }:${seconds > 9 ? "" + seconds : "0" + seconds}`;
};

String.prototype.isJSON = function(str) {
  try {
    JSON.parse(this);
  } catch (e) {
    return false;
  }
  return true;
};
