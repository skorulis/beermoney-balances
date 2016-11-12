function readBalance() {
	var balance = $('.account-balance > A');
	if(balance.length > 0) {
		var text = balance.text().replace("\n","");
		text = text.replace("Your account:$","");
		text = text.replace("\n","");
		saveBalance("qmee",parseFloat(text));
	}
}

setTimeout(function() { readBalance(); }, 3000);
