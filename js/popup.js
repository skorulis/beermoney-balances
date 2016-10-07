readSiteDataArray(function (sites) {
	readMetaData(function(meta) {
		createEntries(sites,meta);
	});
});

function createEntries(sites,metaData) {
	var innerHtml = "";
	console.log(metaData);
	console.log(sites);
	sites.map(function (site) {
		var meta = metaData[site.name];
		var entries = site.entries;
		var balance = entries[entries.length - 1].b;
		var usdText = "";
		if (meta != undefined && meta.conversion != undefined) {
			usdText = " ($" + (balance / meta.conversion).toFixed(2) + ")";
		}
		innerHtml += '<div class="site-balance">';
		innerHtml += "<h2>" + site["name"] + " " + balance + usdText + " </h2>";
		innerHtml += "<p>Checked: " + jQuery.timeago(new Date(site.last * 1000)) + "</p>"
		if (meta != undefined && meta.url != undefined) {
			innerHtml += '<a class="update-link" href="' + meta.url + '" data-site="'+ site.name +'">Update</a>'
		}
		innerHtml += '</div>';
	});
	$("#balances")[0].innerHTML = innerHtml;
	$(".update-link").click(updateBalance);
}


$("#full-link").click(showFullPage);

function updateBalance(event) {
	var url = event.target.href;
	var site = event.target.dataset.site;
	chrome.tabs.create({'url': url,active:false}, function(tab) {
		chrome.runtime.sendMessage({message: "start-update",tab:tab.id,site:site});
    });
	return false;
}

function showFullPage() {
	chrome.tabs.create({'url': chrome.extension.getURL('full.html')}, function(tab) {
		
    });
}


ga('send', 'pageview', "/popup.html");
