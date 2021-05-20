function updateAPI() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
        //Pool stats
        document.getElementById("poolHashrate").innerHTML = convertHashes(data.pool.hashrate + data.pool.hashrateSolo);
        document.getElementById("networkDifficulty").innerHTML = readableNumber(data.network.difficulty);
        document.getElementById("poolWorkers").innerHTML = data.pool.workers + data.pool.workersSolo;

        document.getElementById("blocksFound").innerHTML = data.pool.totalBlocks;
        var blockHeights = [];
        for(var i = 1; i < data.pool.blocks.length; i+=2) {
            blockHeights.push(parseInt(data.pool.blocks[i]));
        }
        blockHeights.sort(function(a, b){return b-a});
        document.getElementById("lastBlockFound").innerHTML =secondsToHm((Date.now() - data.pool.lastBlockFound) / 1000) + "ago";
        document.getElementById("blocksFoundSolo").innerHTML = data.pool.totalBlocksSolo;
        document.getElementById("lastBlockFoundSolo").innerHTML =secondsToHm((Date.now() - data.pool.lastBlockFoundSolo) / 1000) + "ago";
        document.getElementById("blocksFoundEvery").innerHTML = data.pool.hashrate != 0 ? secondsToHm((((data.network.difficulty / data.config.coinDifficultyTarget) / data.pool.hashrate) * 120)) : "Never";
        document.getElementById("currentEffort").innerHTML = (data.pool.roundHashes / data.network.difficulty * 100).toFixed(1) + "%";
        document.getElementById("blocksFoundEverySolo").innerHTML = data.pool.hashrateSolo != 0 ? secondsToHm((((data.network.difficulty / data.config.coinDifficultyTarget) / data.pool.hashrateSolo) * 120)) : "Never";
        document.getElementById("activeWorkersSolo").innerHTML = data.pool.workersSolo;
        document.getElementById("lastReward").innerHTML = data.lastblock.reward / data.config.denominationUnit + " UPX";
        document.getElementById("activeWorkers").innerHTML = data.pool.workers;
        document.getElementById("networkHashrate").innerHTML = convertHashes(data.network.difficulty / data.config.coinDifficultyTarget); 
        document.getElementById("blockchainHeight").innerHTML = readableNumber(data.network.height);

        //Hashrate Chart
        var chartData = processChartData(data.charts.hashrate);
        hashrateChart.data.datasets[0].data = chartData["data"];
        hashrateChart.data.labels = chartData["labels"];
        hashrateChart.update();

        //Diff chart
        chartData = processChartData(data.charts.difficulty);
        diffChart.data.datasets[0].data = chartData["data"];
        diffChart.data.labels = chartData["labels"];
        diffChart.update();

        //Workers chart
        chartData = processChartData(data.charts.workers);
        workersChart.data.datasets[0].data = chartData["data"];
        workersChart.data.labels = chartData["labels"];
        workersChart.update();
        
    });
}

function updatePrice() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(stats => {
        fetch(cgApi).then(Response => Response.json()).then(data => {
            document.getElementById("coinPrice").innerHTML = "$" + data.market_data.current_price.usd;
            document.getElementById("lastRewardUSD").innerHTML = "$" + (data.market_data.current_price.usd * (stats.lastblock.reward / stats.config.denominationUnit)).toFixed(2);
        });
    });
}

function updatePriceGraph() {
    fetch(cgApi + "/market_chart?vs_currency=usd&days=1").then(Response => Response.json()).then(data => {
        var priceLabels = [];
        var priceData = [];
        for (var i = 0; i < data.prices.length; i+=2) {
            var date = new Date(data.prices[i][0]);
            priceLabels.push(date.getHours() + ":" + date.getMinutes());
            priceData.push(data.prices[i][1]);
        }
        priceChart.data.datasets[0].data = priceData;
        priceChart.data.labels = priceLabels;
        priceChart.update();


    });
}

function updateTopMiners() {
    fetch(poolApiUrl + "/get_top10miners").then(Response => Response.json()).then(data => {
        var table = document.getElementById("topMinersTable");
        table.innerHTML = "";
        for(var i = 0; i < data.length; i++) {
            table.innerHTML += '<tr><td>' + data[i].miner + '</td><td style="width: 100px;">' + convertHashes(data[i].hashrate) + '</td></tr>';
        }
    });
}

function updateIndex() {
    updateAPI();
    updatePrice();
    updatePriceGraph();
    updateTopMiners();
}

function processChartData(chartdata) {
    var labels = [];
    var data = [];
    for (var i = 0; i < chartdata.length; i++) {
        labels.push(toTimestring(chartdata[i][0]));
        data.push(chartdata[i][1]);
    }
    return {labels, data};
}

function toTimestring(timestamp, mult = 1000) {
    var date = new Date(timestamp*mult);
    return (date.getMonth() + 1) + "/" + date.getDate() + " " + date.getHours() + ":" + date.getMinutes();
}

var chartOptions = {
    elements: {
        point: {
            pointRadius: 2,
            pointBackgroundColor: "#000"
        }
    },
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false
        }
    },
    title: {
        display: false
    },
    scales: {
        x: {
            ticks: {
                display: false
            }
        },
        y: {
            ticks: {
                display: false
            }
        }
    }
}

var hashrateChart = new Chart(document.getElementById("hashrateChart"), {
    type: 'line',
    data: {
    labels: [],
    datasets: [{ 
        data: [],
        label: "",
        borderColor: "#6060ff",
        fill: false
        }
    ]},
    options: chartOptions
});

var diffChart = new Chart(document.getElementById("diffChart"), {
    type: 'line',
    data: {
    labels: [],
    datasets: [{ 
        data: [],
        label: "",
        borderColor: "#ff0000",
        fill: false
        }
    ]},
    options: chartOptions
});

var workersChart = new Chart(document.getElementById("workersChart"), {
    type: 'line',
    data: {
    labels: [],
    datasets: [{ 
        data: [],
        label: "",
        borderColor: "#25d5f2",
        fill: false
        }
    ]},
    options: chartOptions
});

var priceChart = new Chart(document.getElementById("priceChart"), {
    type: 'line',
    data: {
    labels: [],
    datasets: [{ 
        data: [],
        label: "",
        borderColor: "#ffa500",
        fill: false
        }
    ]},
    options: chartOptions
});

updateIndex();
setInterval(updateIndex, 10000);