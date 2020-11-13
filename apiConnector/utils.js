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
    else            { hDisplay = h + "h "; }
    if(m == 0)      { mDisplay = ""; }
    else            { mDisplay = m + "m "; }
    if(hDisplay + mDisplay == "") return "Unknown";
    return hDisplay + mDisplay; 
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}

function td(content) {
    return "<td>" + content + "</td>";
}