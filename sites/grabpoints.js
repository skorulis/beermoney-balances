function readPoints() {
	readAndSaveSimpleInt("grabpoints",".header-points-value");	
}

setTimeout(function() { readPoints(); }, 2000);