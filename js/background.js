var toClose = {};

var GA_TRACKING_ID = 'UA-23447195-4';
var GA_CLIENT_ID = undefined;

var autoUpdateTabId = undefined;
var autoUpdateSites = [];

function getClientId(completion) {
	if (GA_CLIENT_ID != undefined) {
		completion(GA_CLIENT_ID);
	} else {
		chrome.storage.local.get("GA_CLIENT_ID",function(data) {
			if (Object.keys(data).length == 0) {
				GA_CLIENT_ID = "" + Math.round(2147483647 * Math.random());
				chrome.storage.local.set({GA_CLIENT_ID:GA_CLIENT_ID})
			} else {
				GA_CLIENT_ID = data["GA_CLIENT_ID"];
			}
			completion(GA_CLIENT_ID);
		});
	}
	
}

function logEvent(eventCategory,eventAction) {
	var message = "&t=event&ec=" + eventCategory + "&ea=" + eventAction;
	sendGARequest(message);
}

function logPage(pageName) {
	var message = "&t=pageview&dh=extension&dp=" + pageName;
	sendGARequest(message);
}

function sendGARequest(message) {
	getClientId(function (cliendId) {
		var baseMessage = "v=1&tid=" + GA_TRACKING_ID + "&cid=" + GA_CLIENT_ID + "&aip=1&ds=add-on";
		var fullMessage = baseMessage + message;
		var request = new XMLHttpRequest();
		request.open("POST", "https://www.google-analytics.com/collect", true);
		request.send(fullMessage);
	});
}

function checkAutoUpdates() {
	readDataAndMeta(function(sites,metaData,other) {
		checkNotifications(sites,other);
		if(!other.options.autoEnabled) {
			return;
		}
		var timestamp = Math.floor(Date.now() / 1000);
		var toUpdate = [];
		sites.forEach(function(site) {
			var meta = metaData[site.name];
			if(site.options && site.options.autoRefresh > 0) {
				var diff = timestamp - site.last
				if (diff > site.options.autoRefresh * 60) {
					toUpdate.push(meta.url);
				}
			}
		});
		autoUpdateSites = toUpdate;
		if(toUpdate.length > 0) {
			performAutoUpdates();
		}
	});

	setTimeout(checkAutoUpdates,300000);
}

function lastChange(site) {
	var max = site.entries[site.entries.length - 1].t;
	if (site.secondaryBalances) {
		for(key in site.secondaryBalances) {
			max = Math.max(site.secondaryBalances[key].t,max);
		}
	}
	return max;
}

function checkNotifications(sites,other) {
	if(!other.options.notifyEnabled || other.options.makerKey == undefined) {
		return;
	}
	var timestamp = Math.floor(Date.now() / 1000);
	sites = sites.filter(function(site) {
		return site.entries.length > 0 && site.options != undefined && site.options.notifyTime != undefined && site.options.notifyTime > 0;
	});

	sites.forEach(function(site) {
		var last = lastChange(site);
		if (timestamp - last > site.options.notifyTime * 60) {
			if(site.lastNotification == undefined || site.lastNotification < last) {
				site.lastNotification = timestamp;
				var obj = {};
				obj[site.name] = site;
				chrome.storage.local.set(obj);
				sendNoPointsMessage(site.name,last);
			}
		}
	});
} 

function performAutoUpdates(site) {
	getAutoUpdateTab(function(tab) {
		if (autoUpdateSites.length > 0) {
			var site = autoUpdateSites[0];
			chrome.tabs.update(tab.id,{url:site});	
		} else {
			chrome.tabs.update(tab.id,{url:"/auto.html"});
		}
		
	});
}

function getAutoUpdateTab(callback) {
	if(autoUpdateTabId != undefined) {
		chrome.tabs.get(autoUpdateTabId,function(tab) {
			if (chrome.runtime.lastError) {
				autoUpdateTabId = undefined;
				getAutoUpdateTab(callback);
			} else {
				callback(tab);	
			}
			
		});
	} else {
		chrome.tabs.create({'url': "/auto.html",active:false},function(tab) {
			autoUpdateTabId = tab.id;
			callback(tab);
		});
	}
}

checkAutoUpdates();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if (request.message == "save-options") {
		logEvent("save-options","save-options-" + request.site);
	} else if(request.message == "log-page") {
		logPage(request.pageName);
	} else if(request.message == "log-event") {
		logEvent(request.eventCategory,request.eventAction);
	} else if(request.message == "start-update") {
		toClose[request.site] = request.tab;
	} else if(request.message == "save") {
		if (request.change != 0) {
			logEvent("change-balance","change-" + request.site);
		}
		if(toClose[request.site] == sender.tab.id) {
			toClose[request.site] = null;
			chrome.tabs.remove(sender.tab.id);	
		}
		if(sender.tab.id == autoUpdateTabId) {
			autoUpdateSites.shift();
			performAutoUpdates();
		}
		
	}
});