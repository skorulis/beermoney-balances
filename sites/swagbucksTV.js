function checkSBMeter() {
	setTimeout(checkSBMeter,60000);
	var amount = $("#meterNumber").text();
	if (amount.length > 0) {
		saveSecondaryBalance("swagbucks","SwagbucksTV",amount);
	}

}

checkSBMeter();