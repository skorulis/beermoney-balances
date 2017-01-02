function readPoints() {
	var element = $(".your-earnings > a.point");
	if(element.length == 1) {
		var text = element.text().replace("$","");
		saveBalance("paidviewpoint",parseFloat(text));
	}
}

setTimeout(function() { readPoints(); }, 1000);