var Modules = (Modules || {});

Modules.Subway = (function () {
	var redrawSubway = new Event('redrawSubway');

	var subway_data;

	function RedrawSubway() {
		let container = document.getElementById("subway");
		container.innerHTML = '';

		var parser = new DOMParser();
		doc = parser.parseFromString(subway_data, "text/xml");

		lineNodes = doc.querySelectorAll("subway > line");

		lines = {};
		lineNodes.forEach(row => {
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

			lines[line.name] = line;
		});

		for (i in lines) {
			var line = lines[i];
			if (line.name != "SIR") { /* Nobody cares about Staten Island */
				var html = `<subway-item line="${line.name}" status="${line.status}" />`;
				var node = document.createRange().createContextualFragment(html);
				container.appendChild(node);
			}	
		}
	}

	function SetupHTML() {
		let node = document.createElement('div');
		node.setAttribute('id', 'subway');
		document.body.appendChild(node);
	}

	class SubwayStatus extends HTMLElement {
		constructor() {
			super();

			var line = this.hasAttribute('line') ? this.getAttribute('line') : undefined;
			var status = this.hasAttribute('status') ? this.getAttribute('status') : undefined;

			var shadow = this.attachShadow({ mode: 'open' });
			
			var colours = {
				"1": "red",
				"2": "red",
				"3": "red",
				"7": "purple",
				"4": "green",
				"5": "green",
				"6": "green",
				"A": "blue",
				"C": "blue",
				"E": "blue",
				"B": "orange",
				"D": "orange",
				"F": "orange",
				"M": "orange",
				"G": "lightgreen",
				"J": "brown",
				"Z": "brown",
				"L": "grey",
				"N": "yellow",
				"Q": "yellow",
				"R": "yellow",
				"W": "yellow",
				"S": "grey"
			}

			var spans = "";
			line.split('').forEach(symbol => {
				spans += `<span class='${colours[symbol]}'>${symbol}</span>`;
			});

			var statuscode = status.replace(' ', '');
			var html = `<div class="subway"><div class="symbols">${spans}</div><div id="status" class="${statuscode}">${status}</div></div>`;
			var node = document.createRange().createContextualFragment(html);
			shadow.appendChild(node);

			var style = document.createElement('style');
			style.textContent = `div {
				text-align: center;
			}

			.subway {
				height: 2em;
			}

			span {
				color: white;
				height: 1.3em;
				width: 1.3em;
				display: inline-block;
				text-align: center;
				border-radius: 1em;
			}

			.symbols {
				float: left;
				margin-left: 5%;
			}
			
			.green { background-color: #00933C; }
			.lightgreen { background-color: #6CBE45; }
			.purple { background-color: #B933AD; }
			.red { background-color: #EE352E; }
			.orange { background-color: #FF6319; }
			.yellow { background-color: #FCCC0A; }
			.grey { background-color: #808183; }
			.lightgrey { background-color: #A7A9AC; }
			.brown { background-color: #996633; }
			.blue { background-color: #0039A6; }

			.GOODSERVICE { color: #9E9E9E; }
			.PLANNEDWORK { color: #BF762C; }
			.SERVICECHANGE { color: #BFA42C; }
			.DELAYS { color: #BF2C4E; }

			#status {
				float: right;
				margin-right: 5%;
				width: 55%;
			}`;

			shadow.appendChild(style);
		}
	}

	customElements.define('subway-item', SubwayStatus);

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