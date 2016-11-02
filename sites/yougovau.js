function readPoints() {
	readAndSaveSimpleInt("yougovau",".logins-box-points");	
}

setTimeout(function() { readPoints(); }, 5000);