function readBalance() {
	var balance = $('.benefits-value > DIV > .big-green');
	if(balance.length > 0) {
		var text = balance.text().replace("$","");
		saveBalance("smartpanel",parseFloat(text));
	}
}

setTimeout(function() { readBalance(); }, 3000);
