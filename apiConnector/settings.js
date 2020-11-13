if(getCookie("addr") != "") {
    document.getElementById("addressBox").value = getCookie("addr");
    fetch(poolApiUrl + "/get_miner_payout_level?address=" + getCookie("addr")).then(Response => Response.json()).then(data => {
        document.getElementById("payoutBox").value = data.level;
    });
}

document.getElementById("saveButton").addEventListener("click", function() {
    if(document.getElementById("addressBox").value == "" || document.getElementById("ipBox").value == "" || document.getElementById("payoutBox").value == "") {
        alert("Please fill out all 3 boxes!");
        return;
    }
    fetch(poolApiUrl + "/set_miner_payout_level?address=" + document.getElementById("addressBox").value + "&ip=" + document.getElementById("ipBox").value + "&level=" + document.getElementById("payoutBox").value).then(Response => Response.json()).then(data => {
        if(data.status == "done") {
            alert("New payout level successfully set!");
        }
        else {
            alert("Error: " + data.status);
        }

    });

});