var balanceItem = $("#AccountBalanceLabel");
if (balanceItem.length > 0) {
	var text = balanceItem[0].innerText;
	var bitcoins = parseIntText(text)/100000000.0;
	saveBalance("moonbitcoin",bitcoins);	
}