function readBalance() {
    var balance = $('.user--balance .money');
    if(balance.length > 0) {
        var text = balance.text().replace(" pts","");
        text = text.replace(",","");
        saveBalance("nada",parseInt(text));
    }
}

setTimeout(function() { readBalance(); }, 5000);