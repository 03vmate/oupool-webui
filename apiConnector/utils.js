function convertHashes (hashes) {
    if (hashes < 1e3) {
        return hashes + " H/s"
    }
    else if (hashes > 1e3 && hashes < 1e6) {
        return (hashes / 1e3).toFixed(1) + " kH/s"
    }
    else if (hashes > 1e6 && hashes < 1e9) {
        return (hashes / 1e6).toFixed(1) + " MH/s"
    }
    else if (hashes > 1e9 && hashes < 1e12) {
        return (hashes / 1e9).toFixed(1) + " GH/s"
    }
    else if (hashes > 1e12 && hashes < 1e15) {
        return (hashes / 1e12).toFixed(1) + " TH/s"
    }
    else if (hashes > 1e15 && hashes < 1e18) {
        return (hashes / 1e15).toFixed(1) + " PH/s"
    }
    else if (hashes > 1e18 && hashes < 1e21) {
        return (hashes / 1e18).toFixed(1) + " EH/s"
    }
}

function readableNumber(num) {
    var str = num.toString();
    var out = "";
    var counter = 0;
    for(var i = str.length - 1; i >= 0; i--) {
        if(counter == 3) {
            out = str[i] + " " + out;
            counter = 1;
        }
        else {
            out = str[i] + out;
            counter++;
        }
    }
    return out;
}

function secondsToHm(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var hDisplay = "";
    var mDisplay = "";
    if(h == 0)      { hDisplay = ""; }
    else if(h == 1) { hDisplay = h + " Hour "; }
    else            { hDisplay = h + " Hours "; }
    if(m == 0)      { mDisplay = ""; }
    else if(m == 1) { mDisplay = m + " Minute "; }
    else            { mDisplay = m + " Minutes "; }
    return hDisplay + mDisplay; 
}