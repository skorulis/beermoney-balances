function readBalance() {
	var balance = $(".earned>h5");	
	if(balance.length == 1) {
		var text = balance.text().replace("$","");
		saveBalance("pricepal",parseFloat(text));
	}
	
}

setTimeout(readBalance,1000);