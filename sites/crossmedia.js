function readBalance() {
	var balance = $('#rewards-available');
	if(balance.length > 0) {
		var text = balance.text().replace("$","");
		saveBalance("crossmedia",parseFloat(text));
	}
}

setTimeout(function() { readBalance(); }, 3000);
