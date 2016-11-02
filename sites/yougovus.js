function readPoints() {
	readAndSaveSimpleInt("yougovus",".logins-box-points");	
}

setTimeout(function() { readPoints(); }, 5000);