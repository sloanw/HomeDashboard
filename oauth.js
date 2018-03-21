var oAuth = (function () {
	return {
		GetAuthToken: async function (settings, scope) {
			let authJSON = {
				client_id: settings.clientID,
				redirect_uri: settings.redirectURL,
				response_type: 'code',
				scope: 'openid ' + scope,
				state: GetNonce()
			};

			let init = {
				url: `${settings.authURL}/connect/authorize?${BuildQueryString(authJSON)}`,
				interactive: true
			};
			return new Promise((resolve, reject) => {
				chrome.identity.launchWebAuthFlow(init, function (response) {
					resolve(_GetAuthToken(settings, response));
				});
			});
		}
	};

	async function _GetAuthToken(settings, response) {
		var params = GetURLParams(response);
		var code = params.get('code');
		var state = params.get('state');
		var error = params.get('error');

		if (error) {
			throw error;
		}

		return await GetTokenFromCode(settings, code);
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

	async function GetTokenFromCode(settings, code) {
		let init = {
			method: 'POST',
			async: true,
			headers: {
				'Authorization': 'Basic ' + btoa(`${settings.clientID}:${settings.clientSecret}`),
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: BuildQueryString({
				'grant_type': 'authorization_code',
				'code': code,
				'scope': 'openid api_identity event_log_resident_read'
			})
		};

		init.body += `&redirect_uri=${settings.redirectURL}`;

		return await fetch(`${settings.authURL}/connect/token`, init)
			.then(res => res.json())
			.then(data =>{
				var error = data.error;
				var token = data.access_token;

				if (error) {
					throw error;
				}

				return token;
			});
	}
}());