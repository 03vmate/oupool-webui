document.getElementById("boxButton").addEventListener("click", function() {
    fetch(poolApiUrl + "/stats_address?address=" + document.getElementById("addressBox").value).then(Response => Response.json()).then(data => {
        if(data.error != "Not found") {
            document.cookie = "addr=" + document.getElementById("addressBox").value + ";";
            var now = new Date();
            now.setFullYear(2200);
            document.cookie = "expires=" + now.toUTCString() + ";";
            displayData();
            autoRefresh();
        }
        else {
            alert("Invalid address");
        }
    });
    
});

document.getElementById("addressBox").addEventListener("keyup", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault();
        document.getElementById("boxButton").click();
    }
});

if(getCookie("addr") != "") {
    document.getElementById("addressBox").value = getCookie("addr");
    displayData();
    autoRefresh();
}

function autoRefresh() {
    setInterval(displayData, 10000);
}

function displayData() {
    fetch(poolApiUrl + "/stats").then(Response => Response.json()).then(stats => {
        fetch(poolApiUrl + "/stats_address?address=" + getCookie("addr")).then(Response => Response.json()).then(data => {
            var ui = document.getElementsByClassName('workerStats');
            for (var i = 0; i < ui.length; i++) {
                ui[i].style.visibility = "visible";
            }
            var hashrate = 0;
            for (var i = 0; i < data.workers.length; i++) {
                hashrate += data.workers[i]["hashrate"];
            }
            document.getElementById("poolHashrate").innerHTML = convertHashes(hashrate);
            document.getElementById("pendingBalance").innerHTML = data.stats.balance / stats.config.denominationUnit + " UPX";
            var currentTime = Math.floor(Date.now() / 1000); 
            var nextPayoutTime = Math.floor(stats.pool.payments[1] / 1000);
            while(nextPayoutTime < currentTime) { nextPayoutTime += stats.config.paymentsInterval; }
            document.getElementById("nextPayoutIn").innerHTML = secondsToHm(nextPayoutTime - currentTime);
            document.getElementById("totalPaid").innerHTML = data.stats.paid / stats.config.denominationUnit + " UPX";
            document.getElementById("roundContrib").innerHTML = (data.stats.roundScore * 100 / stats.pool.roundScore).toFixed(1) + "%";
            var workers = data.workers;
            console.log(workers)
            workers.sort(function(a, b) { return parseInt(a["hashrate"]) < parseInt(b["hashrate"]) ? 1 : -1});
            document.getElementById("workersTable").innerHTML = "";
            for (var i = 0; i < workers.length; i++) {
                var workerName = workers[i]["name"] == "undefined" ? "Nameless Worker" : workers[i]["name"];
                var workerHashrate = convertHashes(workers[i]["hashrate"]) + "</span></li>";
                var workerIcon = workers[i]["hashrate"] > 0 ? "fa-check" : "fa-times"
                document.getElementById("workersTable").innerHTML += '<tr><td style="width: 65px; text-align: center;"><a class="fa ' + workerIcon + '"></a></td><td>' + workerName + '</td><td style="width: 100px;">' + workerHashrate + '</td></tr>';
            }

            document.getElementById("transactionTable").innerHTML = "";
            var paymentTime = [];
            var paymentData = [];
            for (var i = 0; i < data.payments.length; i++) {
                if(i%2 == 0) {
                    paymentData.push(data.payments[i].split(':'));
                }
                else {
                    paymentTime.push(data.payments[i]);
                }
            }
            for (var i = 0; i < paymentData.length; i++) {
                var date = new Date(paymentTime[i] * 1000)
                var year = date.getFullYear();
                var month = "0" + (date.getMonth() + 1);
                var day = "0" + date.getDate();
                var hours = "0" + date.getHours();
                var minutes = "0" + date.getMinutes();
                var seconds = "0" + date.getSeconds();
                var formattedTime = year + "/" + month.substr(-2) + "/" + day.substr(-2) + " - " + hours.substr(-2) + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
                document.getElementById("transactionTable").innerHTML += '<tr><td style="width: 200px;">' + formattedTime + '</td><td>' + paymentData[i][0] + '</td><td style="width: 120px;">' + paymentData[i][1] / stats.config.denominationUnit + " UPX" + '</td></tr>';
            }
        })
    });
    
}