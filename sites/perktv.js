function readPoints() {
	var outer = $("#total_points");
	if (outer.length > 0) {
		var total = "";
		outer.find(".odometer-value").each(function() {
			total += $(this).text();
		});
		var value = parseInt(total);
		if(value < 10000000) { //Prevent bad balance reads
			saveBalance("perktv",value);	
		} else {
			setTimeout(function() { readPoints(); }, 5000);			
		}
	} else {
		setTimeout(function() { readPoints(); }, 5000);
	}
}

setTimeout(function() { readPoints(); }, 5000);