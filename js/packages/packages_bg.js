importScripts('/js/secret.js');
importScripts('/js/misc.js');

var access_token;
var refresh_token;
onmessage = function (e) {
	access_token = e.data.access_token;
	refresh_token = e.data.refresh_token;

	RefreshPackages();

	// Run every 5 min
	Scheduler(300000, RefreshPackages);
}

function RefreshPackages() {

	let init = {
		method: 'GET',
		async: true,
		headers: {
			Authorization: 'bearer ' + access_token,
			'Content-Type': 'application/json',
			'Ocp-Apim-Subscription-Key': BuildingLink.apikey
		},
		'contentType': 'json'
	};

	fetch(`${BuildingLink.apiURL}/EventLog/Resident/v1/Events?device-id=${BuildingLink.deviceID}&subscription-key=${BuildingLink.apikey}`, init)
		.then(function (response) {
			if (!response.ok) {
				return postMessage({ error: response.statusText });
			}

			return response.json();
		})
		.then(function (data) {
			postMessage(data.value);
		})
		.catch(err => {
			postMessage({ error: err.message });
		});
}