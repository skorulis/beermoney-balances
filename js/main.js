function saveBalance(site,balance) {
	var timestamp = Math.floor(Date.now() / 1000);
	//var siteData = {entries:[],"last":timestamp};
	var entry = {"t":timestamp,"s":site,"b":balance};
	chrome.storage.local.get(site,function(record) {
		console.log(record);
		if (record[site] == undefined) {
			record = {};
			record[site] = {entries:[],"last":0};
		}
		console.log(record);
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
}

function readAndSaveSimple(site,field) {
	var balanceItem = $(field);
	if (balanceItem.length > 0) {
		balance = balanceItem[0].innerText.replace(/\D/g,'');
		saveBalance(site,parseInt(balance));
	}
}