function generateOptions(sites,metaData) {
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
		html += '<h1 style="text-align:center"><a class="site-link" href="' + meta["url"] + '">'  + meta["name"] + "</a></h1>";
		html += '<form class="opt" id="form-' + site.name + '" action="#">'
		html += '<label for="update-freq">Auto update frequency (minutes)</label><br/>'
		html += '<input min="0" step="5" name="update-freq" type="number" value="' + value +'" >';
		//html += '<input type="submit" value="save" onclick="saveForm(this)">'
		html += '<br/><button>Save</button>';
		html += '</form>'
		html += '</div>';
		$("#main").append(html);
	});

	$("button").click(saveForm);
}

function saveForm(event) {
	event.preventDefault();
	var form = $(event.target).parent()[0];
	var site = form.id.substring(5);
	console.log(form);
	console.log(site);
	
	var updateFreq = parseInt(form["update-freq"].value);
	if (updateFreq < 0) {
		updateFreq = 0;
	} else if (updateFreq < 5) {
		updateFreq = 5;
	}
	console.log(updateFreq);

	var options = {autoRefresh:updateFreq};
	saveOptions(site,options);

	return false;
}

readDataAndMeta(generateOptions);
chrome.runtime.sendMessage({message:"log-page",pageName:"/options.html"});