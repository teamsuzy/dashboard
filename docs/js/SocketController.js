// const io = require("socket.io-client");
let socket = io(`http://${window.location.hostname}:3000`);

var onevent = socket.onevent;
socket.onevent = function (packet) {
    var args = packet.data || [];
    onevent.call(this, packet); // original call
    packet.data = ["*"].concat(args);
    onevent.call(this, packet); // additional call to catch-all
};

socket.on("*", (event, data) => {
    $(`#console`).append(`${event.toString().trim()}: ${data ? data.toString().trim() : '-'}\n`)
    var pos = $(`#console`).scrollTop();
    $(`#console`).scrollTop(pos + 999999999);
});

socket.on("square", (data) => {
    $(`#general-square`).text(data)
});
socket.on("x", (data) => {
    $(`#general-cross`).text(data)
});
socket.on("circle", (data) => {
    $(`#general-circle`).text(data)
});
socket.on("triangle", (data) => {
    $(`#general-triangle`).text(data)
});
socket.on("rf", (data) => {
    data = JSON.parse(data)
    for (var key in data) {
        $(`#general-${key}`).text(data[key])
        if (key == "temperature") {
            window.myChart.config.data.datasets[0].data.push({
                x: Date.now(),
                y: data[key]
            });
            window.myChart.update({
                preservation: true
            });
        }
    }
    var d = new Date()
    $(`#general-time`).text(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`)
});

// var right = 0;
// socket.on("right", (data) => {
//     right = JSON.parse(data).x
//     window.myChart.config.data.datasets[0].data.push({
//         x: Date.now(),
//         y: right
//     });
//     window.myChart.update({
//         preservation: true
//     });
// });


socket.on("left", (data) => {
    // window.myChartTwee.config.data.datasets.forEach(function (dataset) {
    //     dataset.data.push({
    //         x: Date.now(),
    //         y: JSON.parse(data).x
    //     });
    // });
});

$("#command").keyup((event) => {
    if (event.keyCode === 13 && $("#command").val() != '') {
        $("#command_send").click();
    }
});

$("#command_send").click(() => {
    socket.emit('command', $("#command").val());
    $("#command").val('')
})