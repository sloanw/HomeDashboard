var redraw = new Event('redraw');
window.onload = function () {
	this.document.querySelector('button').addEventListener('click', function () {
		RefreshPackages();
	});

	this.document.addEventListener('redraw', RefreshPage);
};

var testData = (function () {
	return {
		packages: [
			{
				"Id": 285443490,
				"PropertyId": 3902,
				"UnitOccupancyId": 1473181,
				"TypeId": 63673,
				"LocationId": null,
				"Description": "USPS",
				"IsOpen": true,
				"CreateUserId": 3287231,
				"OpenComment": "amazon pkg 420100699361289697090191754363",
				"CreateDate": null,
				"LastChangeDate": null,
				"OpenDate": null,
				"CloseComment": "",
				"CloseUserId": null,
				"CloseDate": null,
				"NotificationUserId": 3538118
			}, {
				"Id": 285557302,
				"PropertyId": 3902,
				"UnitOccupancyId": 1473181,
				"TypeId": 63673,
				"LocationId": null,
				"Description": "USPS",
				"IsOpen": true,
				"CreateUserId": 4143601,
				"OpenComment": "420100699341989697090037048644 Amazon Fulfillment Service ",
				"CreateDate": null,
				"LastChangeDate": null,
				"OpenDate": null,
				"CloseComment": "",
				"CloseUserId": null,
				"CloseDate": null,
				"NotificationUserId": null
			}
		]
	}
})();

function RefreshPage() {
	var container = document.getElementById("packages");
	testData.packages.forEach(package => {
		var html = `<package-item type="${package.Description}" descr="${package.OpenComment}" />`;
		var node = document.createRange().createContextualFragment(html);
		container.appendChild(node);
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

class PackageElement extends HTMLElement {
	constructor() {
		super();

		var pkgType = this.hasAttribute('type') ? this.getAttribute('type') : undefined;
		var pkgDesc = this.hasAttribute('descr') ? this.getAttribute('descr') : undefined;

		var shadow = this.attachShadow({ mode: 'open' });
		var container = document.createElement('div');
		container.setAttribute('class', 'package');

		var img = document.createElement('img');
		switch (pkgType) {
			case 'USPS':
				img.src = 'images/pkg_USPS.png';
				break;
			case 'DHL':
				img.src = 'images/pkg_DHL.png';
				break;
			case 'UPS':
				img.src = 'images/pkg_UPS.png';
				break;
		}
		container.appendChild(img);

		var text = document.createElement('span');
		text.innerText = pkgDesc;
		container.appendChild(text);

		var style = document.createElement('style');
		style.textContent = '';
		
		shadow.appendChild(style);
		shadow.appendChild(container);
	}
}
customElements.define('package-item', PackageElement);