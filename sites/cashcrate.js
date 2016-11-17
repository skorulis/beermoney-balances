function readBalance() {
	var balance = $(".navuser-parent-right>a.dynup-cash-balance");
	if(balance.length == 1) {
		var text = balance.text().replace("$","");
		saveBalance("cashcrate",parseFloat(text));
	}
}

setTimeout(readBalance,1000);