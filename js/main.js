function saveBalance(site,balance) {
	if (typeof balance === 'string' ) {
		balance = parseFloat(balance);
	}
	if (isNaN(balance)) {
		//console.error("Got invalid balance " + balance + " for " + site);
		return;
	}
	var timestamp = Math.floor(Date.now() / 1000);
	var entry = {"t":timestamp,"b":balance};
	
	chrome.storage.local.get(site,function(record) {
		if (record[site] == undefined) {
			record = {};
			record[site] = {entries:[],"last":0};
		}
		var entries = record[site].entries;
		var last = entries[entries.length - 1];
		record[site].last = timestamp;
		
		var change = 0;
		if (last == undefined) {
			change = balance;
		} else {
			change = balance - last.b;
		}
		if (change != 0) {
			entries.push(entry);
			
		}
		chrome.storage.local.set(record,function() {
			chrome.runtime.sendMessage({message: "save",site:site,balance:balance,change:change});
		});
	});
}

function saveOptions(site,options) {
	chrome.storage.local.get(site,function(record) {
		record[site].options = options;
		chrome.storage.local.set(record,function() {
			chrome.runtime.sendMessage({message: "save-options",site:site,options});
		});
	});
}

function readSiteDataArray(completion) {
	chrome.storage.local.get(function (data){
		var sites = [];
		var other = {};
		for (var key in data) {
			var site = data[key];
			if(site.entries != undefined) {
				site["name"] = key;
				sites.push(site);	
			} else {
				other[key] = site;
			}
			
		}
		sites.sort(function(a,b) {
			if (a.last > b.last) {
				return -1;
			} else if (a.last < b.last) {
				return 1;
			}
			return 0;
		});
		completion(sites,other);
	});
}

function readMetaData(completion) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var meta = JSON.parse(this.response);
		completion(meta);
	}
	xhr.open("GET", chrome.extension.getURL('/data/meta.json'), true);
	xhr.send();
}

function readAndSaveSimpleInt(site,field) {
	var balanceItem = $(field);
	if (balanceItem.length > 0) {
		var text = balanceItem[0].innerText;
		saveBalance(site,parseIntText(text));
	}
}

function parseIntText(text) {
	var mult = 1;
	var last = text.slice(-1);
	if (last == "k" || last == "K") {	
		mult = 1000;
	}
	var balance = text.replace(/\D/g,'');
	return parseInt(balance)*mult;
}

function readAndSaveSimpleFloat(site,field) {
	var balanceItem = $(field);
	if (balanceItem.length > 0) {
		balance = balanceItem[0].innerText
		saveBalance(site,parseFloat(balance));
	}
}

function readDataAndMeta(completion) {
	readSiteDataArray(function (sites,other) {
		readMetaData(function(meta) {
			completion(sites,meta,other);
		});
	});	
}

function replaceVersionNumber() {
	var manifestData = chrome.runtime.getManifest();
	$("#version").text("version: " + manifestData.version);
}

function sendNoPointsMessage(siteName,lastUpdate,completion) {
	chrome.storage.local.get("options",function(options) {
		var key = options.options.makerKey;
		var url = "https://maker.ifttt.com/trigger/beermoney-no-points/with/key/" + key;
		var timeString = jQuery.timeago(new Date(lastUpdate*1000));
		var message = {value1:siteName,value2:timeString};
		var request = new XMLHttpRequest();
		request.open("POST", url, true);
		request.setRequestHeader("Content-type", "application/json");
		request.send(JSON.stringify(message));
		if(completion) {
			request.onreadystatechange = function() {
				if(request.readyState == 4) {
					if(request.status >= 400) {
						completion(request.statusText);
					} else {
						completion(null);
					}
				}
			}
		}
		
	});
	
}