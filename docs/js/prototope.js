window.onload = function () {
    var ctx = document.getElementById('lineChart').getContext('2d');
    window.myChart = new Chart(ctx, config);

    var ctx2 = document.getElementById('tempChart').getContext('2d');
    window.temperatureChart = new Chart(ctx2, config2)

    var ctx3 = document.getElementById('altChart').getContext('2d');
    window.altitudeChart = new Chart(ctx3, config3)

    var ctx4 = document.getElementById('presChart').getContext('2d');
    window.pressureChart = new Chart(ctx4, config4)

    mapboxgl.accessToken = 'pk.eyJ1IjoibmV0bG9iIiwiYSI6ImNrMXMxOHRzZDBhYnczb2xpbzdrdnZyNmIifQ.lTSGs952BP7cCjLhWUjuRw';
    window.map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/satellite-v9',
        center: [4.6589133, 52.3079303], // starting position
        zoom: 13
    });
    map.on('load', function () {
        map.addSource('cansat', {
            type: 'geojson',
            data: {
                "geometry": {
                    "type": "Point",
                    "coordinates": []
                },
                "type": "Feature",
                "properties": {}
            }
        });
        map.addLayer({
            "id": "cansat",
            "type": "symbol",
            "source": "cansat",
            "layout": {
                "icon-image": "rocket-15"
            }
        });
        window.mapLoaded = true
        // map.addLayer({
        //     "id": "route",
        //     "type": "line",
        //     "source": {
        //         "type": "geojson",
        //         "data": {
        //             "type": "Feature",
        //             "properties": {},
        //             "geometry": {
        //                 "type": "LineString",
        //                 "coordinates": [
        //                     [4.6589133, 52.3079303],
        //                     [4.6589234, 52.3079204]
        //                 ]
        //             }
        //         }
        //     },
        //     "layout": {
        //         "line-join": "round",
        //         "line-cap": "round"
        //     },
        //     "paint": {
        //         "line-color": "#42b983",
        //         "line-width": 80
        //     }
        // });
    })
}

var meters = [document.querySelector('#general-1'), document.querySelector('#general-2'), document.querySelector('#general-3'), document.querySelector('#general-4')]

// meters.map(meter => {
//     return new Odometer({
//         el: meter,
//         value: 0
//     });
// })

window.odometerOptions = {
    duration: 100
};

var chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

function randomScalingFactor() {
    return (Math.random() > 0.5 ? 1.0 : -1.0) * Math.round(Math.random() * 10);
}

function onRefresh(chart) {}

var config = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Temperature',
            backgroundColor: "rgb(66, 185, 131)",
            borderColor: "rgb(66, 185, 131)",
            fill: false,
            pointRadius: 0,
            lineTension: 0.1,
            data: []
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            padding: {
                left: 10,
                right: 0,
                top: 0,
                bottom: 10
            }
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 20000,
                    // duration: 300000,
                    //     refresh: 50,
                    delay: 700
                },
                time: {
                    unit: "second",
                    displayFormats: {
                        quarter: "ll"
                    }
                },
                gridLines: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    // maxTicksLimit: 4,
                    autoSkip: true,
                    maxRotation: 0,
                    minRotation: 0
                },
                // type: 'time',
                distribution: "linear",
                display: true
            }],
            yAxes: [{
                ticks: {
                    padding: 10,
                    beginAtZero: false,
                    display: true,
                    // precision: 0.01,
                    // stepSize: 0.01,
                    // maxTicksLimit: 10
                    // min: 26,
                    // max: 26.5
                }
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: "rgb(66, 185, 131)",
            titleMarginBottom: 10,
            titleFontSize: 14,
            borderColor: "rgb(66, 185, 131)",
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: "index",
            caretPadding: 10
            // enabled: false
        }
    }
};

var config2 = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Temperature',
            backgroundColor: "#4e73df ",
            borderColor: "#4e73df ",
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            lineTension: 0,
            data: []
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            padding: {
                left: 10,
                right: 0,
                top: 0,
                bottom: 10
            }
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 5000,
                    delay: 700
                },
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
}

var config3 = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Altitude',
            backgroundColor: "rgb(66, 185, 131)",
            borderColor: "rgb(66, 185, 131)",
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            lineTension: 0,
            data: []
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            padding: {
                left: 10,
                right: 0,
                top: 0,
                bottom: 10
            }
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 5000,
                    delay: 700
                },
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
}
var config4 = {
    type: 'line',
    data: {
        datasets: [{
            label: 'Pressure',
            backgroundColor: "#36b9cc",
            borderColor: "#36b9cc",
            borderWidth: 2,
            fill: false,
            pointRadius: 0,
            lineTension: 0,
            data: []
        }]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            padding: {
                left: 10,
                right: 0,
                top: 0,
                bottom: 10
            }
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    duration: 4166,
                    delay: 700
                },
                display: false
            }],
            yAxes: [{
                display: false
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            enabled: false
        }
    }
}

if (!library)
    var library = {};

library.json = {
    replacer: function (match, pIndent, pKey, pVal, pEnd) {
        var key = '<span class=json-key>';
        var val = '<span class=json-value>';
        var str = '<span class=json-string>';
        var r = pIndent || '';
        if (pKey)
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        if (pVal)
            r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
        return r + (pEnd || '');
    },
    prettyPrint: function (obj) {
        var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
        return JSON.stringify(obj, null, 3)
            .replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(jsonLine, library.json.replacer);
    }
};