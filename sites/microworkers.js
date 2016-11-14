function readBalance() {
	var balance = $(".employeestatus>.clo01:first-child>p:nth-child(2)>strong")
	if(balance.length > 0) {
		var text = balance.text().replace("$","");
		saveBalance("microworkers",parseFloat(text));
	}
}

setTimeout(function() { readBalance(); }, 3000);