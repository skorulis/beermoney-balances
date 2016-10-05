chrome.storage.local.get(function (data){
	var innerHtml = "";
	var sites = [];
	for (var key in data) {
		var site = data[key];
		site["name"] = key;
		sites.push(site);
	}
	sites.sort(function(a,b) {
		if (a.last > b.last) {
			return -1;
		} else if (a.last < b.last) {
			return 1;
		}
		return 0;
	});
	console.log(sites);
	sites.map(function (site) {
		var entries = site.entries;
		innerHtml += "<h2>" + site["name"] + " " + entries[entries.length - 1].b + "</h2>";
		innerHtml += "<p>Checked: " + jQuery.timeago(new Date(site.last * 1000)) + "</p>"
	});
	$("#balances")[0].innerHTML = innerHtml;
});