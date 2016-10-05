var earningsBlock = $("#earningsBlock");
if (earningsBlock.length > 0) {
	var text = earningsBlock.children(".textBox")[0];
	var amount = $(text).text().substring(1);
	saveBalance("inboxDollars",parseFloat(amount));
}