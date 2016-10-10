var elements = $(":contains(Balance:)");
if (elements.length > 0) {
	var last = elements[elements.length - 1];
	var regex = /([0-9]*[.])[0-9]*/g;
	var match = regex.exec(last.innerText);
	if (match.length > 0) {
		var value = match[0];	
		saveBalance("prolific",parseFloat(value));
	}
}