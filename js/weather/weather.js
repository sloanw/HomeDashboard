var Modules = (Modules || {});

Modules.Weather = (function () {
	var redrawWeather = new Event('redrawWeather');

	var weather_data = {};

	function RedrawWeather() {
		let container = document.getElementById("weather");
		container.innerHTML = '';

		if (weather_data && weather_data.currently) {
			var period = weather_data.currently;
			var html = `<weather-item temp="${period.apparentTemperature}" icon="${period.icon}" />`;
			var node = document.createRange().createContextualFragment(html);
			container.appendChild(node);
		}
	}

	class WeatherElement extends HTMLElement {
		constructor() {
			super();

			var shadow = this.attachShadow({ mode: 'open' });
			var css = document.createElement('link');
			css.setAttribute('rel', 'stylesheet');
			css.setAttribute('href', 'css/weather-icons.css');
			shadow.appendChild(css);

			var container = document.createElement('div');
			container.setAttribute('class', 'forecast');

			for (i = 0; i < this.attributes.length; i++) {
				let attr = this.attributes[i];

				let node = document.createElement('div');

				switch (attr.name) {
					case 'icon':
						node.setAttribute('class', `wi ${attr.value}`);
						break;
					default:
						node.setAttribute('class', attr.name);
						node.innerText = attr.value;
				}

				container.appendChild(node);
			}

			shadow.appendChild(container);
		}
	}
	customElements.define('weather-item', WeatherElement);

	return {
		Init: function () {
			document.addEventListener('redrawWeather', RedrawWeather);

			var WeatherWorker = new Worker('js/weather/weather_bg.js');
			WeatherWorker.onmessage = (data => {
				weather_data = data.data;
				document.dispatchEvent(redrawWeather);
			});

			WeatherWorker.postMessage('');
		}
	};
}());