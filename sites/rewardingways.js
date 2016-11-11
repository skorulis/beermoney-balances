var item = $('a[href="/members/history.php"');
if(item.length == 1) {
	var text = item.parent().text()
	text = text.replace("$","").replace("(View History)","");
	saveBalance("rewardingways",parseFloat(text));	
}