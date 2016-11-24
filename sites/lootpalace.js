function readBalance() {
	var element = $("#currentpoints>span>span.pp");
	console.log(element);
	if(element.length == 1) {
		var text = element.text();
		saveBalance("lootpalace",parseInt(text));
	}
}

setTimeout(readBalance, 3000);

