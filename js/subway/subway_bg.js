importScripts('/js/misc.js');

onmessage = function (e) {
	RefreshSubway();

	Scheduler(120000, RefreshSubway);
}

function RefreshSubway() {
	var apiURL = "http://web.mta.info/status/serviceStatus.txt";

	$http(apiURL)
		.get()
		.then(response => {
			/* TODO - Find a way to parse XML in worker */
			postMessage(response);
		});
}