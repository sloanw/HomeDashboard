importScripts('/js/secret.js');
importScripts('/js/misc.js');

var token;
onmessage = function (e) {
	token = e.data;

	RefreshPackages();

	// Run every 5 min
	Scheduler(300000, RefreshPackages);
}

function RefreshPackages() {
	let init = {
		method: 'GET',
		async: true,
		headers: {
			Authorization: 'bearer ' + token,
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': BuildingLink.apikey
		},
		'contentType': 'json'
	};

	fetch(`${BuildingLink.apiURL}/EventLog/Resident/v1/Events?device-id=${BuildingLink.deviceID}&subscription-key=${BuildingLink.apikey}`, init)
		.then((response) => response.json())
		.then(function (data) {
			postMessage(data.value);
		})
		.catch(err => alert(err));
}