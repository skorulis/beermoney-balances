function readBalance() {
	var balance = $('[title="Current Cash"] > A');
	if(balance.length > 0) {
		var text = balance.text().replace("$","");
		saveBalance("pocketmoneygpt",parseFloat(text));
	}
}

setTimeout(function() { readBalance(); }, 3000);
