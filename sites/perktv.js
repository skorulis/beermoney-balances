function readPoints() {
	var outer = $("#total_points");
	console.log(outer);
	if (outer.length > 0) {
		var total = "";
		console.log(outer.find(".odometer-value"));
		outer.find(".odometer-value").each(function() {
			total += $(this).text();
		});
		saveBalance("perkTV",parseInt(total));
	}
}

setTimeout(function() { readPoints(); }, 5000);