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
            var listElement = document.createElement("li");
            listElement.className = "traffic-sales-content list-group-item";
            var nameElement = document.createElement("span");
            nameElement.className = "traffic-sales-name";
            nameElement.appendChild(document.createTextNode(formattedTime));
            var foundby = document.createElement("span");
            foundby.className = "traffic-sales-amount";
            foundby.appendChild(document.createTextNode(blockData[i][1]));
            var height = document.createElement("span");
            height.className = "traffic-sales-amount height";
            height.appendChild(document.createTextNode(blockIDs[i]));
            var blockHash = document.createElement("span");
            blockHash.className = "traffic-sales-amount";
            blockHash.appendChild(document.createTextNode(blockData[i][0] + ":" + blockData[i][2]));
            listElement.appendChild(height);
            listElement.appendChild(nameElement);
            listElement.appendChild(foundby);
            listElement.appendChild(blockHash);
            table.appendChild(listElement);
        }

    });
}

document.getElementById("fetchMoreBlocks").addEventListener("click", function() {
    var elements = document.getElementsByClassName("height");
    var oldestBlockDisplayed = parseInt(elements[0].innerHTML);
    for(var i = 0; i < elements.length; i++) {
        if(parseInt(elements[i].innerHTML) < oldestBlockDisplayed) {
            oldestBlockDisplayed = parseInt(elements[i].innerHTML);
        }
    }
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
            var listElement = document.createElement("li");
            listElement.className = "traffic-sales-content list-group-item";
            var nameElement = document.createElement("span");
            nameElement.className = "traffic-sales-name";
            nameElement.appendChild(document.createTextNode(formattedTime));
            var foundby = document.createElement("span");
            foundby.className = "traffic-sales-amount";
            foundby.appendChild(document.createTextNode(blockData[i][1]));
            var height = document.createElement("span");
            height.className = "traffic-sales-amount height";
            height.appendChild(document.createTextNode(blockIDs[i]));
            var blockHash = document.createElement("span");
            blockHash.className = "traffic-sales-amount";
            blockHash.appendChild(document.createTextNode(blockData[i][0] + ":" + blockData[i][2]));
            listElement.appendChild(height);
            listElement.appendChild(nameElement);
            listElement.appendChild(foundby);
            listElement.appendChild(blockHash);
            table.appendChild(listElement);
        }
    });
});

updateBlocksTable();
setInterval(updateBlocksTable, 10000);