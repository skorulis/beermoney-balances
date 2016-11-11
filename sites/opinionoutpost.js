function readBalance() {
	var balance = $('.earnedPoints');
	if(balance.length > 0) {
		var text = balance.text().replace(" pts","");
		saveBalance("opinionoutpost",parseInt(text));
	}
}

setTimeout(function() { readBalance(); }, 3000);
