var elements = $("#topbal");

if (elements.length == 1) {
	var balText = elements.attr("data-balcur");
	var bal = parseInt(balText)/10000;
	saveBalance("clixsense",bal);
}