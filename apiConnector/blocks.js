function blockStatus(network, block, depth) {
    var confirmedAt = parseInt(block) + parseInt(depth)
    if(confirmedAt <= network) {
        return "Confirmed";
    }
    else {
        return parseInt(depth) - (parseInt(network) - parseInt(block)) + 1 + " Blocks Left";
    }
}

var oldestBlockDisplayed = 0;

function updateBlocksTable() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
        document.getElementById("poolBlocksFound").innerHTML = data.pool.totalBlocks;
        document.getElementById("poolBlocksFoundSolo").innerHTML = data.pool.totalBlocksSolo;
        document.getElementById("poolBlocksFoundEvery").innerHTML = data.pool.hashrate != 0 ? secondsToHm((((data.network.difficulty / data.config.coinDifficultyTarget) / data.pool.hashrate) * 120)) : "Never";
        document.getElementById("avgLuck").innerHTML = (data.pool.totalShares / data.pool.totalDiff * 100).toFixed(0) + "%";
        var blocks = data.pool.blocks;
        var blockData = [];
        for(var i = 0; i < blocks.length; i++) {
            if(i % 2 == 0) {
                var arr = [];
                if(blocks[i].split(':')[6] == 1) {
                    var temp = blocks[i].split(':');
                    temp.pop();
                    temp.push("1");
                    temp.push("0");
                    arr = temp;
                }
                else {
                    if(blocks[i].split(':').length == 8) {
                        arr = blocks[i].split(':');
                    }
                    else {
                        var temp = blocks[i].split(':');
                        temp.pop();
                        temp.push("0");
                        temp.push("Waiting...");
                        arr = temp;
                    }
                }
                blockData.push(arr.concat(blocks[i + 1]));
            }
        }
        blockData = blockData.sort(function(a, b) { return parseInt(a[8]) < parseInt(b[8]) ? 1 : -1});
        oldestBlockDisplayed = 99999999999;
        var table = document.getElementById("blocksTable");
        table.innerHTML = "";
        for(var i = 0; i < blockData.length; i++) {
            var date = new Date(blockData[i][3] * 1000)
            var year = date.getFullYear();
            var month = "0" + (date.getMonth() + 1);
            var day = "0" + date.getDate();
            var hours = "0" + date.getHours();
            var minutes = "0" + date.getMinutes();
            var seconds = "0" + date.getSeconds();
            var formattedTime = year + "/" + month.substr(-2) + "/" + day.substr(-2) + " - " + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
            table.innerHTML += "<tr>" + td(formattedTime) + td(blockData[i][8]) + td(blockData[i][7] != "Waiting..." ? (blockData[i][7] / data.config.denominationUnit).toFixed(2) + " UPX" : blockData[i][7]) + td(blockData[i][2]) + td((blockData[i][0] == "solo" ? "Solo" : "Prop")) + td(blockData[i][1]) + td((blockData[i][5] / blockData[i][4] * 100).toFixed(0) + "%") + td(blockData[i][6] == 1 ? "Orphaned" : (blockData[i][9] + data.config.depth <= data.network.height) ? "Confirmed" : blockStatus(data.network.height, blockData[i][8], data.config.depth)) + "</tr>";
            if(blockData[i][8] < oldestBlockDisplayed) oldestBlockDisplayed = blockData[i][8];
        }

    });
}

document.getElementById("fetchMoreBlocks").addEventListener("click", function() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(stats => {
        fetch(poolApiUrl + "/get_blocks?height=" + oldestBlockDisplayed).then(Response => Response.json()).then(data => {
            var blocks = data;
            var blockData = [];
            for(var i = 0; i < blocks.length; i++) {
                if(i % 2 == 0) {
                    var arr = [];
                    if(blocks[i].split(':')[6] == 1) {
                        var temp = blocks[i].split(':');
                        temp.pop();
                        temp.push("1");
                        temp.push("0");
                        arr = temp;
                    }
                    else {
                        if(blocks[i].split(':').length == 8) {
                            arr = blocks[i].split(':');
                        }
                        else {
                            var temp = blocks[i].split(':');
                            temp.pop();
                            temp.push("0");
                            temp.push("Waiting...");
                            arr = temp;
                        }
                    }
                    blockData.push(arr.concat(blocks[i + 1]));
                }
            }
            blockData = blockData.sort(function(a, b) { return parseInt(a[8]) < parseInt(b[8]) ? 1 : -1});
            var table = document.getElementById("blocksTable");
            for(var i = 0; i < blockData.length; i++) {
                var date = new Date(blockData[i][3] * 1000)
                var year = date.getFullYear();
                var month = "0" + (date.getMonth() + 1);
                var day = "0" + date.getDate();
                var hours = "0" + date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = year + "/" + month.substr(-2) + "/" + day.substr(-2) + " - " + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                table.innerHTML += "<tr>" + td(formattedTime) + td(blockData[i][8]) + td(blockData[i][7] != "Waiting..." ? (blockData[i][7] / stats.config.denominationUnit).toFixed(2) + " UPX" : blockData[i][7]) + td(blockData[i][2]) + td((blockData[i][0] == "solo" ? "Solo" : "Prop")) + td(blockData[i][1]) + td((blockData[i][5] / blockData[i][4] * 100).toFixed(0) + "%") + td(blockData[i][6] == 1 ? "Orphaned" : (blockData[i][9] + stats.config.depth <= stats.network.height) ? "Confirmed" : blockStatus(stats.network.height, blockData[i][8], stats.config.depth)) + "</tr>";
                if(blockData[i][8] < oldestBlockDisplayed) oldestBlockDisplayed = blockData[i][8];
            }
        });
    });
    clearInterval(autoRefresh);
});

updateBlocksTable();
var autoRefresh = setInterval(updateBlocksTable, 10000);