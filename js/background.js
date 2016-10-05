var toClose = {};

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	console.log(request);
	if(request.message == "start-update") {
		toClose[request.site] = request.tab;
	} else if(request.message == "save") {
		if(toClose[request.site] == sender.tab.id) {
			toClose[request.site] = null;
			chrome.tabs.remove(sender.tab.id);	
		}
		
	}
});