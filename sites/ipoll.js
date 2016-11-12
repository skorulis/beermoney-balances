function readBalance() {
	var balance = $('.yourearnings-content > DIV').children('H4').eq(0);
	if(balance.length > 0) {
		var text = balance.text().replace("$","");
		saveBalance("ipoll",parseFloat(text));
	}
}

setTimeout(function() { readBalance(); }, 3000);
