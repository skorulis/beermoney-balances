function readPoints() {
	var outer = $("#total_points");
	if (outer.length > 0) {
		var total = "";
		console.log(outer.find(".odometer-value"));
		outer.find(".odometer-value").each(function() {
			total += $(this).text();
		});
		var value = parseInt(total);
		if(value < 10000000) { //Prevent bad balance reads
			saveBalance("perktv",value);	
		}
	}
}

setTimeout(function() { readPoints(); }, 5000);