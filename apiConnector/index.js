function updateAPI() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
        //Pool stats
        document.getElementById("poolHashrate").innerHTML = convertHashes(data.pool.hashrate);
        document.getElementById("poolWorkers").innerHTML = data.pool.workers;
        document.getElementById("poolBlocksFound").innerHTML = data.pool.totalBlocks;
        document.getElementById("poolBlocksFoundSolo").innerHTML = data.pool.totalBlocksSolo;
        document.getElementById("poolBlocksFoundEvery").innerHTML = data.pool.hashrate != 0 ? secondsToHm((((data.network.difficulty / data.config.coinDifficultyTarget) / data.pool.hashrate) * 120)) : "Never";
        document.getElementById("poolCurrentEffort").innerHTML = (data.pool.roundHashes / data.network.difficulty * 100).toFixed(1) + "%";
        document.getElementById("poolLastReward").innerHTML = data.lastblock.reward / 100 + " UPX";

        var currentTime = Math.floor(Date.now() / 1000); 
        var nextPayoutTime = Math.floor(data.pool.payments[1] / 1000);
        while(nextPayoutTime < currentTime) { nextPayoutTime += data.config.paymentsInterval; }
        document.getElementById("poolNextPayout").innerHTML = secondsToHm(nextPayoutTime - currentTime);

        //Network stats
        document.getElementById("networkDifficulty").innerHTML = readableNumber(data.network.difficulty);
        document.getElementById("networkHashrate").innerHTML = convertHashes(data.network.difficulty / data.config.coinDifficultyTarget); 
        document.getElementById("networkHeight").innerHTML = readableNumber(data.network.height);

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
            fillColor: '#dbdeff',
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
            lineColor: '#ff407b',
            fillColor: '#ffdbe6',
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
            fillColor: '#dffaff',
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
    fetch(cgApi).then(Response => Response.json()).then(data => {
        document.getElementById("coinPrice").innerHTML = "$" + data.market_data.current_price.usd;
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
            lineColor: '#fec957',
            fillColor: '#fff2d5',
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
        for(var i = 0; i < data.length; i++) {
            var listElement = document.createElement("li");
            listElement.className = "traffic-sales-content list-group-item";
            var nameElement = document.createElement("span");
            nameElement.className = "traffic-sales-name";
            nameElement.appendChild(document.createTextNode(data[i].miner));
            var valueElement = document.createElement("span");
            valueElement.className = "traffic-sales-amount";
            valueElement.appendChild(document.createTextNode(convertHashes(data[i].hashrate)));
            listElement.appendChild(nameElement);
            listElement.appendChild(valueElement);
            document.getElementById("topMiners").appendChild(listElement);
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