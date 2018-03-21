window.onload = function () {
	this.document.querySelector('button').addEventListener('click', function () {
		RefreshPackages();
	});
};

function RefreshPackages() {
	oAuth.GetAuthToken(BuildingLink, 'api_identity event_log_resident_read')
		.then(token => {
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
					document.getElementById("header").innerText = `you have ${data.value.length} packages`;
					var outupt = document.getElementById("output");
					data.value.forEach(package => {
						output.innerText += package.OpenComment;
					});
				})
				.catch(err => alert(err));
		});
}