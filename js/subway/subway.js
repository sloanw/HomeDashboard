var Modules = (Modules || {});

Modules.Subway = (function () {
	var redrawSubway = new Event('redrawSubway');

	var subway_data;

	function RedrawSubway() {

	}

	function SetupHTML() {
		let node = document.createElement('div');
		node.setAttribute('id', 'subway');
		document.body.appendChild(node);
	}

	var SubwayWorker;
	return {
		Init: function () {
			document.addEventListener('redrawSubway', RedrawSubway);

			SubwayWorker = new Worker('js/subway/subway_bg.js');
			SubwayWorker.onmessage = (data => {
				subway_data = data.data;
				document.dispatchEvent(redrawSubway);
			});

			SetupHTML();
		},
		Start: function () {
			SubwayWorker.postMessage('');
		}
	};
}());