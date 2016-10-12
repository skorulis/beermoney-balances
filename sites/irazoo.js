function readPoints() {
	var selector = 'a[ui-sref="app.point-history"]>.ng-binding';
	var element = $(selector);
	if (element.length > 0) {
		readAndSaveSimpleInt("irazoo",selector);
	} else {
		setTimeout(readPoints,2000);		
	}
}

setTimeout(readPoints,3000);

