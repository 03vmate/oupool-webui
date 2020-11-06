function updateBlocksTable() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
        
        document.getElementById("poolBlocksFound").innerHTML = data.pool.totalBlocks;
        document.getElementById("poolBlocksFoundSolo").innerHTML = data.pool.totalBlocksSolo;
        document.getElementById("poolBlocksFoundEvery").innerHTML = data.pool.hashrate != 0 ? secondsToHm((((data.network.difficulty / data.config.coinDifficultyTarget) / data.pool.hashrate) * 120)) : "Never";
        
        var blockIDs = [];
        var blockHashes = [];
        for(var i = 0; i < data.pool.blocks.length; i++) {
            if(i % 2) {
                blockIDs.push(data.pool.blocks[i]);
            } 
            else {
                blockHashes.push(data.pool.blocks[i].split(':')[2]);
            }
        }
        for(var i = 0; i < blockIDs.length; i++) {
            var listElement = document.createElement("li");
            listElement.className = "traffic-sales-content list-group-item";
            var nameElement = document.createElement("span");
            nameElement.className = "traffic-sales-name";
            nameElement.appendChild(document.createTextNode(blockIDs[i]));
            var valueElement = document.createElement("span");
            valueElement.className = "traffic-sales-amount";
            valueElement.appendChild(document.createTextNode(blockHashes[i]));
            listElement.appendChild(nameElement);
            listElement.appendChild(valueElement);
            document.getElementById("blocksTable").appendChild(listElement);
        }

    });
}

updateBlocksTable();


