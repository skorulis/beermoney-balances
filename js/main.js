// Standard Google Universal Analytics code
(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga'); // Note: https protocol here

ga('create', 'UA-23447195-4', 'auto');
ga('set', 'checkProtocolTask', function(){}); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');

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
	ga('send', 'event', 'Change balance', site);
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

function readSiteDataArray(completion) {
	chrome.storage.local.get(function (data){
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
		completion(sites);
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

function replaceVersionNumber() {
	var manifestData = chrome.runtime.getManifest();
	$("#version").text("version: " + manifestData.version);
}