function readBalance() {
	var element = $(".odometer-inside");
	var balance = undefined;
	if(element.length == 1) {
		var text = element.find(".odometer-value, .odometer-formatting-mark").text();
		balance = parseFloat(text);
	}

	if (balance == undefined) {
		setTimeout(function() { readBalance(); }, 2000);
	} else {
		saveBalance("pureprofile",balance);
	}

}

setTimeout(function() { readBalance(); }, 2000);