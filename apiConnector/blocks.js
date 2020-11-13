function blockStatus(network, block, depth) {
    var confirmedAt = parseInt(block) + parseInt(depth)
    if(confirmedAt <= network) {
        return "Confirmed";
    }
    else {
        return parseInt(depth) - (parseInt(network) - parseInt(block)) + " Blocks Left";
    }
}

var oldestBlockDisplayed = 0;

function updateBlocksTable() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
        
        document.getElementById("poolBlocksFound").innerHTML = data.pool.totalBlocks;
        document.getElementById("poolBlocksFoundSolo").innerHTML = data.pool.totalBlocksSolo;
        document.getElementById("poolBlocksFoundEvery").innerHTML = data.pool.hashrate != 0 ? secondsToHm((((data.network.difficulty / data.config.coinDifficultyTarget) / data.pool.hashrate) * 120)) : "Never";
        document.getElementById("avgLuck").innerHTML = Math.round(data.pool.totalShares / data.pool.totalDiff * 100) + "%";
        
        var blockIDs = [];
        var blockData = [];
        for(var i = 0; i < data.pool.blocks.length; i++) {
            if(i % 2) {
                blockIDs.push(data.pool.blocks[i]);
            } 
            else {
                blockData.push(data.pool.blocks[i].split(':'));
            }
        }
        oldestBlockDisplayed = blockIDs[0];

        var table = document.getElementById("blocksTable");
        table.innerHTML = "";
        for(var i = 0; i < blockIDs.length; i++) {
            var date = new Date(blockData[i][3] * 1000)
            var year = date.getFullYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hours = "0" + date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = year + "/" + month.substr(-2) + "/" + day.substr(-2) + " - " + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            table.innerHTML += "<tr>" + td(formattedTime) + td(blockIDs[i]) + td(blockData[i][7]) + td(blockData[i][2]) + td((blockData[i][0] == "solo" ? "Solo" : "Prop")) + td(blockData[i][1]) + td((blockData[i][5] / blockData[i][4] * 100).toFixed(0) + "%") + td((blockIDs[i] + data.config.depth <= data.network.height) ? "Confirmed" : blockStatus(data.network.height, blockIDs[i], data.config.depth)) + "</tr>";
            if(blockIDs[i] < oldestBlockDisplayed) oldestBlockDisplayed = blockIDs[i];
        }

    });
}

document.getElementById("fetchMoreBlocks").addEventListener("click", function() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(stats => {
        fetch(poolApiUrl + "/get_blocks?height=" + oldestBlockDisplayed).then(Response => Response.json()).then(data => {
            var blockIDs = [];
            var blockData = [];
            for(var i = 0; i < data.length; i++) {
                if(i % 2) {
                    blockIDs.push(data[i]);
                } 
                else {
                    blockData.push(data[i].split(':'));
                }
            }
            var table = document.getElementById("blocksTable");
            for(var i = 0; i < blockIDs.length; i++) {
                var date = new Date(blockData[i][3] * 1000)
                var year = date.getFullYear();
                var month = "0" + (date.getMonth() + 1);
                var day = "0" + date.getDate();
                var hours = "0" + date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = year + "/" + month.substr(-2) + "/" + day.substr(-2) + " - " + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                table.innerHTML += "<tr>" + td(formattedTime) + td(blockIDs[i]) + td(blockData[i][7]) + td(blockData[i][2]) + td((blockData[i][0] == "solo" ? "Solo" : "Prop")) + td(blockData[i][1]) + td((blockData[i][5] / blockData[i][4] * 100).toFixed(0) + "%") + td((blockIDs[i] + stats.config.depth <= stats.network.height) ? "Confirmed" : blockStatus(stats.network.height, blockIDs[i], stats.config.depth)) + "</tr>";
                if(blockIDs[i] < oldestBlockDisplayed) oldestBlockDisplayed = blockIDs[i];
            }
        });
    });
    clearInterval(autorefresh);
});

updateBlocksTable();
var autorefresh = setInterval(updateBlocksTable, 10000);