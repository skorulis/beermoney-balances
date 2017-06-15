function readPoints() {
	var element = $(".points-count");
	if (element.length == 1) {
		var text = element.text()
		saveBalance("perktv",parseFloat(text));
	} else {
		setTimeout(function() { readPoints(); }, 5000);
	}

}

setTimeout(function() { readPoints(); }, 5000);