function readPoints() {
	var outer = $("#odometer");
	if (outer.length > 0) {
		var total = "";
		console.log(outer.find(".num"));
		outer.find(".num").each(function() {
			total += $(this).text();
		});
	}
}

setTimeout(function() { readPoints(); }, 5000);