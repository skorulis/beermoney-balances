var toClose = {};

var GA_TRACKING_ID = 'UA-23447195-4';
var GA_CLIENT_ID = undefined;

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

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	if(request.message == "log-page") {
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
		
	}
});