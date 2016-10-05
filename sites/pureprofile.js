function readBalance() {
	var outer = $("#topbar");
	if (outer.length == 0) {
		outer = $('nav.navbar-fixed-top');
	}

	console.log(outer);
	if (outer.length > 0) {
		var metric = outer.find(".profile-metric")[0];
		var balance = $(metric).children('strong')[0];
		var amount = $(balance).text().substring(1);
		console.log(balance);
		if (balance == undefined) {
			setTimeout(function() { readBalance(); }, 2000);
		} else {
			saveBalance("pureprofile",amount);
		}
	}
}

setTimeout(function() { readBalance(); }, 2000);