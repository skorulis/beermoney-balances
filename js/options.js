replaceVersionNumber();

var options;

function generateOptions(sites,metaData,other) {
	console.log(sites);
	options = other["options"];
	if(options == undefined) {
		options = {autoEnabled:true};
		chrome.storage.local.set({options:options});
	}

	sites = sites.filter(function(s) {
		return s.entries != undefined && s.entries.length > 0 && metaData[s.name] != undefined;
	});

	sites = sites.sort(function(a,b) {
		return b.last - a.last;
	});


	sites.forEach(function (site) {
		var meta = metaData[site.name];
		var html = '<div class="site-options">';
		var value = site.options ? site.options.autoRefresh : 0;
		var notifyValue = site.options ? site.options.notifyTime : 0;
		html += '<h1 style="text-align:center"><a class="site-link" href="' + meta["url"] + '">'  + meta["name"] + "</a></h1>";
		html += '<form class="opt pure-form pure-form-aligned" id="form-' + site.name + '" action="#">';
		html += '<div class="pure-control-group">';
		html += '<label for="update-freq">Auto update frequency (minutes)</label>';
		html += '<input min="0" step="5" name="update-freq" type="number" value="' + value +'" >';
		html += '</div>';
		html += '<div class="pure-control-group">';
		html += '<label for="notification-freq">Inactivity notification period (minutes)</label>';
		html += '<input min="0" step="10" name="notification-freq" type="number" value="' + notifyValue +'" >';
		html += '</div>';
		html += '<button class="site-save btn-outline">Save</button>';
		html += '</form>';
		html += '</div>';
		$("#main").append(html);
	});

	$("button.site-save").click(saveForm);
	$("#opt-auto-enabled").click(updateAutoEnabled);
	$("#opt-notify-enabled").click(updateNotifyEnabled);
	$("#opt-auto-enabled").prop("checked",options.autoEnabled);
	$("#opt-notify-enabled").prop("checked",options.notifyEnabled);

	$("#opt-maker-key").prop("value",options.makerKey);

	$("#send-test").click(sendTestNotification);
	$("#opt-main-save").click(saveMainOptions);
}

function saveForm(event) {
	event.preventDefault();
	var form = $(event.target).parent()[0];
	var site = form.id.substring(5);
	console.log(form);
	console.log(site);
	
	var updateFreq = parseInt(form["update-freq"].value);
	var notifyTime = parseInt(form["notification-freq"].value);
	updateFreq = snapValue(updateFreq,5);
	notifyTime = snapValue(notifyTime,10);

	var options = {autoRefresh:updateFreq,notifyTime:notifyTime};
	saveOptions(site,options);

	return false;
}

function snapValue(value,min) {
	if (value <= 0) {
		value = 0;
	} else if (value < min) {
		value = min;
	}
	return value;
}

function updateAutoEnabled(event) {
	options.autoEnabled = event.target.checked;
	chrome.storage.local.set({options:options});
}

function updateNotifyEnabled(event) {
	options.notifyEnabled = event.target.checked;
	chrome.storage.local.set({options:options});
}

function sendTestNotification(event) {
	saveMainOptions(event);
	if(options.makerKey.length == 0) {
		alert("Cannot test notifications without setting up your IFTTT maker key");
		return;
	}
	event.preventDefault();
	sendNoPointsMessage("EXAMPLE",new Date().getTime()/1000,function(error) {
		if(error) {
			alert("Something went wrong with the IFTTT notification test, make sure your maker key is entered correctly");	
		} else {
			alert("Notification successfully sent");
		}
		
	});
	return false;
}

function saveMainOptions(event) {
	event.preventDefault();
	var form = $(event.target).parent().parent()[0];
	console.log(form);
	options.makerKey = form["maker-key"].value;
	console.log(options.makerKey);
	chrome.storage.local.set({options:options});
}

readDataAndMeta(generateOptions);
chrome.runtime.sendMessage({message:"log-page",pageName:"/options.html"});