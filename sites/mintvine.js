function readBalance() {
	var balance = $('#main-nav > ul > li > a[href$="transactions"]');
	if(balance.length > 0) {
		var text = balance.text().replace("Points","");
		saveBalance("mintvine",parseInt(text));
	}
}

setTimeout(function() { readBalance(); }, 500);
