importScripts('secret.js');
importScripts('misc.js');

onmessage = function (e) {
	RefreshWeather();

	// Run every 5 min
	Scheduler(300000, RefreshWeather);
}

var blocks = {
    now : "currently",
    min : "minutely",
    hrs : "hourly",
    day : "daily",
    msg : "alerts",
    flg : "flags"
};

function RefreshWeather() {
	var apiURL = "https://api.darksky.net/forecast";
	var lat = Weather.position.latitude;
	var lon = Weather.position.longitude;
	var url = `${apiURL}/${Weather.apikey}/${lat},${lon}`;

	var args = { exclude: blocks.min + "," + blocks.day + "," + blocks.flg };

	$http(url)
		.get(args)
		.then(response => {
			postMessage(JSON.parse(response));
		})
		.catch(err => { console.log(err) });
}