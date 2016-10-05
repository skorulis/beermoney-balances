console.log("TEST");
function readBalance() {
	var balance = $("#user-balance-count");
	if(balance.length > 0) {
		var text = balance.text().replace("HC","");
		saveBalance("gifthulk",parseInt(text));
	}	
}

setTimeout(function() { readBalance(); }, 500);
