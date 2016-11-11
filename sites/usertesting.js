var item = $("#ste-payment_status");
if(item.length == 1) {
	var text = item.clone().children().remove().end().text();
	text = text.replace("$","");
	saveBalance("usertesting",parseFloat(text));
}