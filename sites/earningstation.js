function readBalance() {
	var balance = $('#headerBalance');
	if(balance.length > 0) {
		var text = balance.text().replace(" SD","");
		saveBalance("earningstation",parseInt(text));
	}
}

setTimeout(function() { readBalance(); }, 5000);
