importScripts('/js/misc.js');

onmessage = function (e) {
	RefreshSubway();

	Scheduler(120000, RefreshSubway);
}

function RefreshSubway() {
	var apiURL = "http://web.mta.info/status/serviceStatus.txt";

	$http(apiURL)
		.get()
		.then(response => {
			var parser = new DOMParser();
			doc = parser.parseFromString(response, "text/xml");

			var subway_data = {};
			lines = doc.querySelectorAll("subway > line");

			lines.forEach(row => {
				var line = {};

				for (var i = 0; i < row.children.length; i++) {
					let element = row.children[i];

					let name = element.nodeName;
					let value = element.innerHTML;

					switch (name) {
						case 'name':
						case 'status':
							line[name] = value;
							break;
						default:
							//do nothing
					}
				}

				subway_data.add(line);
			});

			postMessage(subway_data)
		});
}