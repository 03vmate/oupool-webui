var latestTimestamp = 0;

function updatePaymentsTable() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(data => {
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
        var table = document.getElementById("paymentsTable");
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
            table.innerHTML += '<tr><td style="width: 200px;">' + formattedTime + '</td><td>' + paymentData[i][0] + '</td><td style="width: 120px;">' + (paymentData[i][1] / data.config.denominationUnit + " UPX") + '</td></tr>';
        }

    });
}

document.getElementById("fetchMorePayments").addEventListener("click", function() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(stats => {
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
            var table = document.getElementById("paymentsTable");
            for(var i = 0; i < paymentTimestamps.length; i++) {
                var date = new Date(paymentTimestamps[i] * 1000)
                var year = date.getFullYear();
                var month = "0" + (date.getMonth() + 1);
                var day = "0" + date.getDate();
                var hours = "0" + date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = year + "/" + month.substr(-2) + "/" + day.substr(-2) + " - " + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                table.innerHTML += '<tr><td style="width: 200px;">' + formattedTime + '</td><td>' + paymentData[i][0] + '</td><td style="width: 120px;">' + (paymentData[i][1] / stats.config.denominationUnit + " UPX") + '</td></tr>';
            }
        });
    });
    clearInterval(autoRefresh);
});

updatePaymentsTable();
var autoRefresh = setInterval(updatePaymentsTable, 10000);