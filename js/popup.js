function reloadAll() {
	readSiteDataArray(function (sites) {
		readMetaData(function(meta) {
			createEntries(sites,meta);
		});
	});	
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

	sites = sites.filter(function(s) {
		return s.entries.length > 0;
	});

	sites.forEach(function (site) {
		var meta = metaData[site.name];
		var entries = site.entries;
		var balance = entries[entries.length - 1].b;
		var usdText = "";
		if (meta != undefined && meta.conversion != undefined) {
			usdText = "$" + (balance / meta.conversion).toFixed(2);
		}
		innerHtml += '<div class="site-balance">';
		innerHtml += '<div>';
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
		innerHtml += '</div>';
		if (meta != undefined && meta.url != undefined) {
			innerHtml += '<a class="update-link plain" href="' + meta.url + '" data-site="'+ site.name +'"><i class="plain icon-arrows-cw" style="color:#2c3e50" ></i></a>'
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
	$("#sup-link").click(showLink);
}


$("#full-link").click(showFullPage);

function updateBalance(event) {
	var url = getEventHref(event);
	var site = $(event.target).parent()[0].dataset.site;
	ga('send', 'event', 'Update balance', site);
	chrome.tabs.create({'url': url,active:false}, function(tab) {
		chrome.runtime.sendMessage({message: "start-update",tab:tab.id,site:site});
    });
	return false;
}

function showFullPage() {
	chrome.tabs.create({'url': chrome.extension.getURL('full.html')});
	return false;
}

function showLink(event) {
	var url = getEventHref(event);
	chrome.tabs.create({'url': url});
	return false;
}

function getEventHref(event) {
	var url = event.target.href;
	if (url == undefined) {
		url = $(event.target).parent()[0].href;
	}
	return url;
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.message == "save") {
		reloadAll();
	}
});

function trackView() {
	ga('send', 'pageview', "/popup.html");	
}

setTimeout(function() { trackView(); }, 1000);
reloadAll();
replaceVersionNumber();
