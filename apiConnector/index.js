function updateAPI() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
        //Pool stats
        document.getElementById("poolHashrate").innerHTML = convertHashes(data.pool.hashrate + data.pool.hashrateSolo);
        document.getElementById("networkDifficulty").innerHTML = readableNumber(data.network.difficulty);
        document.getElementById("poolWorkers").innerHTML = data.pool.workers;

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
        var currentTime = Math.floor(Date.now() / 1000); 
        var nextPayoutTime = Math.floor(data.pool.payments[1] / 1000);
        while(nextPayoutTime < currentTime) { nextPayoutTime += data.config.paymentsInterval; }
        document.getElementById("nextPayoutIn").innerHTML = secondsToHm(nextPayoutTime - currentTime);
        document.getElementById("networkHashrate").innerHTML = convertHashes(data.network.difficulty / data.config.coinDifficultyTarget); 
        document.getElementById("blockchainHeight").innerHTML = readableNumber(data.network.height);

        //Hashrate Chart
        var hashrateLabels = [];
        var hashrateData = [];
        for (var i = 0; i < data.charts.hashrate.length; i++) {
            var date = new Date(data.charts.hashrate[i][0] * 1000)
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            hashrateLabels.push(hours + ':' + minutes.substr(-2));
            hashrateData.push(data.charts.hashrate[i][1]);
        }
        $("#sparkline-revenue").sparkline(hashrateData, {
            type: 'line',
            width: '99.5%',
            height: '100',
            lineColor: '#5969ff',
            fillColor: '#222222',
            lineWidth: 2,
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            resize: true,
            tooltipFormat: '',
            cursor: '',
            highlightLineColor: '',
            highlightSpotColor: ''
        });

        //Diff Chart
        var diffLabels = [];
        var diffData = [];
        for (var i = 0; i < data.charts.difficulty.length; i++) {
            var date = new Date(data.charts.difficulty[i][0] * 1000)
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            diffLabels.push(hours + ':' + minutes.substr(-2));
            diffData.push(data.charts.difficulty[i][1]);
        }
        $("#sparkline-revenue2").sparkline(diffData, {
            type: 'line',
            width: '99.5%',
            height: '100',
            lineColor: '#ff0000',
            fillColor: '#222222',
            lineWidth: 2,
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            resize: true,
            tooltipFormat: '',
            cursor: '',
            highlightLineColor: '',
            highlightSpotColor: ''
        });

        //Diff Chart
        var workersLabels = [];
        var workersData = [];
        for (var i = 0; i < data.charts.workers.length; i++) {
            var date = new Date(data.charts.workers[i][0] * 1000)
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            workersLabels.push(hours + ':' + minutes.substr(-2));
            workersData.push(data.charts.workers[i][1]);
        }
        $("#sparkline-revenue3").sparkline(workersData, {
            type: 'line',
            width: '99.5%',
            height: '100',
            lineColor: '#25d5f2',
            fillColor: '#222222',
            lineWidth: 2,
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            resize: true,
            tooltipFormat: '',
            cursor: '',
            highlightLineColor: '',
            highlightSpotColor: ''
        });
        
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
        for (var i = 0; i < data.prices.length; i++) {
            var date = new Date(data.prices[i][0] * 1000);
            var hours = date.getHours();
            var minutes = "0" + date.getMinutes();
            priceLabels.push(hours + ':' + minutes.substr(-2));
            priceData.push(data.prices[i][1]);
        }
        
        $("#sparkline-revenue4").sparkline(priceData, {
            type: 'line',
            width: '99.5%',
            height: '100',
            lineColor: '#ffa500',
            fillColor: '#222222',
            lineWidth: 2,
            spotColor: '',
            minSpotColor: '',
            maxSpotColor: '',
            resize: true,
            tooltipFormat: '',
            cursor: '',
            highlightLineColor: '',
            highlightSpotColor: ''
        });


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

updateIndex();
setInterval(updateIndex, 10000);