var element = $("#transfer_earnings");
if (element.length > 0) {
	var text = element.children(".reward").text();
	var amount = parseFloat(text.substring(1));
	saveBalance("mturk",amount);
}