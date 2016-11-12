function readPoints() {
	var outer = $("#odometer");
	if (outer.length > 0) {
		var total = "";
		outer.find(".num").each(function() {
			total += $(this).text();
		});
		saveBalance("checkpoints",parseInt(total));
	}
}

setTimeout(function() { readPoints(); }, 5000);