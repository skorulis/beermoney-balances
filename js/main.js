function saveBalance(site,balance) {
	if (isNaN(balance)) {
		console.error("Got invalid balance " + balance + " for " + site);
		return;
	}
	var timestamp = Math.floor(Date.now() / 1000);
	var entry = {"t":timestamp,"b":balance};
	console.log(chrome);
	chrome.storage.local.get(site,function(record) {
		if (record[site] == undefined) {
			record = {};
			record[site] = {entries:[],"last":0};
		}
		var entries = record[site].entries;
		var last = entries[entries.length - 1];
		record[site].last = timestamp;
		if (last == undefined || last.b != balance) {
			console.log("Change");
			entries.push(entry);
		}
		chrome.storage.local.set(record,function() {
			console.log("saved ");
		});
	});
	chrome.runtime.sendMessage({message: "save",site:site});

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
		console.log(balanceItem[0].innerText);
		console.log(balanceItem.text());
		balance = balanceItem[0].innerText.replace(/\D/g,'');
		saveBalance(site,parseInt(balance));
	}
}

function readAndSaveSimpleFloat(site,field) {
	var balanceItem = $(field);
	if (balanceItem.length > 0) {
		balance = balanceItem[0].innerText
		saveBalance(site,parseFloat(balance));
	}
}