readSiteDataArray(function (sites) {
	var innerHtml = "";
	
	console.log(sites);
	sites.map(function (site) {
		var entries = site.entries;
		innerHtml += "<h2>" + site["name"] + " " + entries[entries.length - 1].b + "</h2>";
		innerHtml += "<p>Checked: " + jQuery.timeago(new Date(site.last * 1000)) + "</p>"
	});
	$("#balances")[0].innerHTML = innerHtml;
});


$("#full-link").click(showFullPage);

function showFullPage() {
	chrome.tabs.create({'url': chrome.extension.getURL('full.html')}, function(tab) {
		
    });
}

