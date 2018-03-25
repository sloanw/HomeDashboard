var Weather = (function () {
	var weather_data = {};

	function RedrawWeather() {
		let container = document.getElementById("weather");

		if (weather_data && weather_data.currently) {
			container = document.getElementById("weather");
			container.innerText = weather_data.currently.apparentTemperature;
		}
	}

	return {
		Init: function () {
			document.addEventListener('redraw', RedrawWeather);

			var WeatherWorker = new Worker('js/weather/weather_bg.js');
			WeatherWorker.onmessage = (data => {
				weather_data = data.data;
				document.dispatchEvent(redraw);
			});

			WeatherWorker.postMessage('');
		}
	};
}());