window.onload = function () {
    var ctx = document.getElementById('lineChart').getContext('2d');
    window.myChart = new Chart(ctx, config);


    // var ctx2 = document.getElementById('lineChart2').getContext('2d');
    // window.myChartTwee = new Chart(ctx2, config);
};

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

var color = Chart.helpers.color;
var config = {
    type: 'line',
    data: {
        datasets: [{
            label: '1',
            backgroundColor: "#4e73df",
            borderColor: "#4e73df",
            fill: false,
            pointRadius: 0,
            lineTension: 1,
            data: []
        }]
        // datasets: [{
        //         label: '1',
        //         backgroundColor: "#4e73df",
        //         borderColor: "#4e73df",
        //         fill: false,
        //         pointRadius: 0,
        //         // lineTension: 0,
        //         data: []
        //     },
        //     {
        //         label: '2',
        //         backgroundColor: "#1cc88a",
        //         borderColor: "#1cc88a",
        //         fill: false,
        //         pointRadius: 0,
        //         cubicInterpolationMode: 'monotone',
        //         data: []
        //     },
        //     {
        //         label: '3',
        //         backgroundColor: "#36b9cc",
        //         borderColor: "#36b9cc",
        //         fill: false,
        //         pointRadius: 0,
        //         cubicInterpolationMode: 'monotone',
        //         data: []
        //     },
        //     {
        //         label: '4',
        //         backgroundColor: "#f6c23e",
        //         borderColor: "#f6c23e",
        //         fill: false,
        //         pointRadius: 0,
        //         cubicInterpolationMode: 'monotone',
        //         data: []
        //     }
        // ]
    },
    options: {
        maintainAspectRatio: false,
        responsive: true,
        layout: {
            padding: {
                //   left: 10,
                //   right: 25,
                //   top: 25,
                //   bottom: 0
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            }
        },
        scales: {
            xAxes: [{
                type: 'realtime',
                realtime: {
                    ttl: 5000,
                    duration: 5000,
                    //     refresh: 50,
                    //     delay: 0,
                    //     pause: true
                },
                time: {
                    unit: "month",
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
                    display: true
                }
            }]
        },
        legend: {
            display: false
        },
        tooltips: {
            backgroundColor: "#0096db",
            titleMarginBottom: 10,
            titleFontSize: 14,
            borderColor: "rgba(0, 150, 219, 1)",
            borderWidth: 1,
            xPadding: 15,
            yPadding: 15,
            displayColors: false,
            intersect: false,
            mode: "index",
            caretPadding: 10
        }
    }
};