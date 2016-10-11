var headerCount = $(".count-padder");
if (headerCount.length > 0) {
	readAndSaveSimpleInt("usabilityhub",".count-padder");
} else {
	var elements = $(":contains(You've accumulated)");
	if(elements.length > 0) {
		var valueElement = elements.children("b");
		if (valueElement.length > 0) {
			var value = valueElement[0].innerText;
			saveBalance("usabilityhub",parseIntText(value));
		}
	}	
}