function reloadAll() {
	readSiteDataArray(function (sites) {
		readMetaData(function(meta) {
			createEntries(sites,meta);
		});
	});	

	var manifestData = chrome.app.getDetails();
	console.log(manifestData.version);

}

function createEntries(sites,metaData) {
	var innerHtml = "";
	console.log(metaData);
	console.log(sites);
	if(sites.length == 0) {
		$("#no-balances").show();
		$("#balances").hide();
	} else {
		$("#no-balances").hide();
		$("#balances").show();
	}

	sites.map(function (site) {
		var meta = metaData[site.name];
		var entries = site.entries;
		var balance = entries[entries.length - 1].b;
		var usdText = "";
		if (meta != undefined && meta.conversion != undefined) {
			usdText = "$" + (balance / meta.conversion).toFixed(2);
		}
		innerHtml += '<div class="site-balance">';
		innerHtml += "<h2>" + site["name"] + " ";
		if (meta.conversion == 1) {
			innerHtml += usdText;
		} else if(usdText.length > 0) {
			innerHtml += balance + " (" + usdText + ")";
		} else {
			innerHtml += balance;
		}

		innerHtml += "</h2>";
		innerHtml += "<p>Checked: " + jQuery.timeago(new Date(site.last * 1000)) + "</p>"
		if (meta != undefined && meta.url != undefined) {
			innerHtml += '<a class="update-link" href="' + meta.url + '" data-site="'+ site.name +'">Update</a>'
		}
		innerHtml += '</div>';
	});
	$("#balances").html(innerHtml);
	setupLinks();
}

function setupLinks() {	
	$(".update-link").click(updateBalance);
	$("#twitter-link").click(showLink);
	$("#home-link").click(showLink);
	$("#home-link").click(showLink);
	$("#sup-link").click(showLink);
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
	chrome.tabs.create({'url': chrome.extension.getURL('full.html')});
}

function showLink(event) {
	console.log(event.target.href);
	var url = event.target.href;
	if (url == undefined) {
		url = $(event.target).parent()[0].href;
	}
	console.log(url);
	chrome.tabs.create({'url': url});
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.message == "save") {
		reloadAll();
	}
});


ga('send', 'pageview', "/popup.html");
reloadAll();
