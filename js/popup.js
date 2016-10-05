readSiteDataArray(function (sites) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var meta = JSON.parse(this.response);
		createEntries(sites,meta);	
	}
	xhr.open("GET", chrome.extension.getURL('/data/meta.json'), true);
	xhr.send();
});

function createEntries(sites,metaData) {
	var innerHtml = "";
	console.log(metaData);
	console.log(sites);
	sites.map(function (site) {
		var meta = metaData[site.name];
		console.log(meta);
		var entries = site.entries;
		var balance = entries[entries.length - 1].b;
		var usdText = "";
		if (meta != undefined && meta.conversion != undefined) {
			usdText = " ($" + (balance / meta.conversion).toFixed(2) + ")";
		}
		innerHtml += '<div class="site-balance">';
		innerHtml += "<h2>" + site["name"] + " " + balance + usdText + " </h2>";
		innerHtml += "<p>Checked: " + jQuery.timeago(new Date(site.last * 1000)) + "</p>"
		innerHtml += '</div>';
	});
	$("#balances")[0].innerHTML = innerHtml;
}


$("#full-link").click(showFullPage);

function showFullPage() {
	chrome.tabs.create({'url': chrome.extension.getURL('full.html')}, function(tab) {
		
    });
}


ga('send', 'pageview', "/popup.html");
