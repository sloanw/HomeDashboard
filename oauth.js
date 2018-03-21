var authURL = 'https://auth.buildinglink.com';
var apiURL = "https://api.buildinglink.com";

var redirectURL = `${chrome.identity.getRedirectURL()}api-callback`;

window.onload = function () {
	this.document.querySelector('button').addEventListener('click', function () {
		RefreshPackages();
	});
};

function RefreshPackages() {
	let authJSON = {
		client_id: clientID,
		redirect_uri: redirectURL,
		response_type: 'code',
		scope: 'openid api_identity event_log_resident_read',
		state: GetNonce()
	};

	chrome.identity.launchWebAuthFlow({
		'url': `${authURL}/connect/authorize?${BuildQueryString(authJSON)}`,
		interactive: true
	}, function (returnURL) {

		var params = GetURLParams(returnURL);
		var code = params.get('code');
		var state = params.get('state');
		var error = params.get('error');

		if (error) {
			throw error;
		}

		GetAuthToken(code)
			.then((response) => response.json())
			.then(function (data) {

				var error = data.error;
				var token = data.access_token;

				if (error) {
					throw error;
				}

				if (token) {
					let init = {
						method: 'GET',
						async: true,
						headers: {
							Authorization: 'bearer ' + token,
							'Content-Type': 'application/json',
							'Ocp-Apim-Subscription-Key': apikey
						},
						'contentType': 'json'
					};
					fetch(`${apiURL}/EventLog/Resident/v1/Events?device-id=${deviceID}&subscription-key=${apikey}`, init)
						.then((response) => response.json())
						.then(function (data) {
							document.getElementById("header").innerText = `you have ${data.value.length} packages`;
							var outupt = document.getElementById("output");
							data.value.forEach(package => {
								output.innerText += package.OpenComment;
							});
						})
						.catch(err => alert(err));
				}
			})
			.catch(err => alert(err));
	});
}

function GetURLParams(url) {
	url = new URL(url);

	return new URLSearchParams(url.search.slice(1));
}

function GetCodeFromURL(returnURL) {
	var url = new URL(returnURL);
	var params = new URLSearchParams(url.search.slice(1));

	return params.get('code');
}

function BuildQueryString(json) {
	var query = '';

	for (i in json) {
		query += `&${i}=${encodeURIComponent(json[i])}`;
	}

	return query.slice(1);
}

function GetNonce() {
	var arr = new Uint32Array(10);
	window.crypto.getRandomValues(arr);

	var nonce = "";
	for (i in arr) {
		nonce += String.fromCharCode((arr[i] % 55) + 65);
	}

	return nonce;
}

function GetAuthToken(code) {
	let init = {
		method: 'POST',
		async: true,
		headers: {
			'Authorization': 'Basic ' + btoa(`${clientID}:${clientSecret}`),
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: BuildQueryString({
			'grant_type': 'authorization_code',
			'code': code,
			'scope': 'openid api_identity event_log_resident_read'
		})
	};

	init.body += `&redirect_uri=${redirectURL}`;

	return fetch(`${authURL}/connect/token`, init)
}