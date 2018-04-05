chrome.browserAction.onClicked.addListener(function() {
	// chrome.tabs.create({url: 'index.html'});
	chrome.windows.create({
		url: 'index.html',
		type: 'popup',
		width: 500,
		height: 330
	});
});