var balanceItem = $('.signedInInfo>a[href="/Account/Balances.aspx"]');
if(balanceItem.length == 1) {
	var text = balanceItem.text();
	text = text.replace("Points: ","");
	saveBalance("rewardscentral",parseInt(text));	
}
