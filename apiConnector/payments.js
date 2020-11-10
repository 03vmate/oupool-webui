var latestTimestamp = 0;
var denom = 100;

function updatePaymentsTable() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
        denom = data.config.denominationUnit;
        document.getElementById("totalPayments").innerHTML = data.pool.totalPayments;
        document.getElementById("minPayout").innerHTML = data.config.minPaymentThreshold / data.config.denominationUnit + " UPX";
        document.getElementById("payoutInterval").innerHTML = secondsToHm(data.config.paymentsInterval);
        var currentTime = Math.floor(Date.now() / 1000); 
        var nextPayoutTime = Math.floor(data.pool.payments[1] / 1000);
        while(nextPayoutTime < currentTime) { nextPayoutTime += data.config.paymentsInterval; }
        document.getElementById("nextPayoutIn").innerHTML = secondsToHm(nextPayoutTime - currentTime);
        
        var paymentTimestamps = [];
        var paymentData = [];
        for(var i = 0; i < data.pool.payments.length; i++) {
            if(i % 2) {
                paymentTimestamps.push(data.pool.payments[i]);
            } 
            else {
                paymentData.push(data.pool.payments[i].split(':'));
            }
        }
        
        var _latestTimestamp = paymentTimestamps[0];
        for(var i = 0; i < paymentTimestamps.length; i++) {
            if(paymentTimestamps[i] < _latestTimestamp) _latestTimestamp = paymentTimestamps[i];
        }
        latestTimestamp = _latestTimestamp;
        var table = document.getElementById("blocksTable");
        table.innerHTML = "";
        for(var i = 0; i < paymentTimestamps.length; i++) {
            var date = new Date(paymentTimestamps[i] * 1000)
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
            foundby.appendChild(document.createTextNode(paymentData[i][1] / data.config.denominationUnit + " UPX"));
            var blockHash = document.createElement("span");
            blockHash.className = "traffic-sales-amount";
            blockHash.appendChild(document.createTextNode(paymentData[i][0]));
            listElement.appendChild(nameElement);
            listElement.appendChild(foundby);
            listElement.appendChild(blockHash);
            table.appendChild(listElement);
        }

    });
}

document.getElementById("fetchMorePayments").addEventListener("click", function() {
    fetch(poolApiUrl + "/get_payments?time=" + latestTimestamp).then(Response => Response.json()).then(data => {
        var paymentTimestamps = [];
        var paymentData = [];
        for(var i = 0; i < data.length; i++) {
            if(i % 2) {
                paymentTimestamps.push(data[i]);
            } 
            else {
                paymentData.push(data[i].split(':'));
            }
        }
        var _latestTimestamp = paymentTimestamps[0];
        for(var i = 0; i < paymentTimestamps.length; i++) {
            if(paymentTimestamps[i] < _latestTimestamp) _latestTimestamp = paymentTimestamps[i];
        }
        latestTimestamp = _latestTimestamp;
        var table = document.getElementById("blocksTable");
        for(var i = 0; i < paymentTimestamps.length; i++) {
            var date = new Date(paymentTimestamps[i] * 1000)
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
            foundby.appendChild(document.createTextNode(paymentData[i][1] / denom + " UPX"));
            var blockHash = document.createElement("span");
            blockHash.className = "traffic-sales-amount";
            blockHash.appendChild(document.createTextNode(paymentData[i][0]));
            listElement.appendChild(nameElement);
            listElement.appendChild(foundby);
            listElement.appendChild(blockHash);
            table.appendChild(listElement);
        }
    });
});

updatePaymentsTable();
setInterval(updatePaymentsTable, 10000);