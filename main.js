var redraw = new Event('redraw');
window.onload = function () {
	this.document.querySelector('button').addEventListener('click', function () {
		RefreshPackages();
	});

	this.document.addEventListener('redraw', RefreshPage);
};

function RefreshPage() {
	document.getElementById("header").innerText = `you have ${packages.length} packages`;
	var outupt = document.getElementById("output");
	packages.forEach(package => {
		output.innerText += package.OpenComment;
	});
}

var packages = [];
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
					packages = data.value;
					document.dispatchEvent(redraw);
				})
				.catch(err => alert(err));
		});
}