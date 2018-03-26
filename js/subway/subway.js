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
			var html = `<subway-item line="${line.name}" status="${line.status}" />`;
			var node = document.createRange().createContextualFragment(html);
			container.appendChild(node);
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

			var container = document.createElement('div');
			container.setAttribute('class', 'subway');

			var symbolContainer = document.createElement('div');
			symbolContainer.setAttribute('class', 'symbols');

			var html = "";
			switch (line) {
				case '123':
					html += "<span class='red'>1</span>";
					html += "<span class='red'>2</span>";
					html += "<span class='red'>3</span>";
					break;
				case '7':
					html += "<span class='purple'>7</span>";
					break;
				case '456':
					html += "<span class='green'>4</span>";
					html += "<span class='green'>5</span>";
					html += "<span class='green'>6</span>";
					break;
				case 'ACE':
					html += "<span class='blue'>A</span>";
					html += "<span class='blue'>C</span>";
					html += "<span class='blue'>E</span>";
					break;
				case 'BDFM':
					html += "<span class='orange'>B</span>";
					html += "<span class='orange'>D</span>";
					html += "<span class='orange'>F</span>";
					html += "<span class='orange'>M</span>";
					break;
				case 'G':
					html += "<span class='lightgreen'>G</span>";
					break;
				case 'JZ':
					html += "<span class='brown'>J</span>";
					html += "<span class='brown'>Z</span>";
					break;
				case 'L':
					html += "<span class='grey'>L</span>";
					break;
				case 'NQR':
					html += "<span class='yellow'>N</span>";
					html += "<span class='yellow'>Q</span>";
					html += "<span class='yellow'>R</span>";
					html += "<span class='yellow'>W</span>";
					break;
				case 'S':
					html += "<span class='grey'>S</span>";
					break;
				default:
				//do nothing
			}
			var node = document.createRange().createContextualFragment(html);
			symbolContainer.appendChild(node);
			container.appendChild(symbolContainer);

			var node = document.createElement('div');
			node.setAttribute('id', 'status');
			node.setAttribute('class', status.replace(' ', ''));
			node.innerText = status;
			container.appendChild(node);

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
			.lightgreen { background-color: #78CE47; }
			.purple { background-color: #B933AD; }
			.red { background-color: #EE352E; }
			.orange { background-color: #FF6319; }
			.yellow { background-color: #FCCC0A; }
			.grey { background-color: #808183; }
			.lightgrey { background-color: #A7A9AC; }
			.brown { background-color: #996633; }
			.blue { background-color: #0039A6; }


			#status {
				float: right;
				margin-right: 5%;
			}`;

			shadow.appendChild(style);

			shadow.appendChild(container);
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