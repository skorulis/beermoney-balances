function readBalance() {
	var balance = $('.pointsAmount');
	if(balance.length > 0) {
		var text = balance.text().replace(" PTS","");
		saveBalance("pinecone",parseInt(text));
	}
}

setTimeout(function() { readBalance(); }, 1000);
