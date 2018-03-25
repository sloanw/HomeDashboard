var Modules = (Modules || {});

Modules.Packages = (function () {
	var redrawPackages = new Event('redrawPackages');

	var package_data = [];

	function RedrawPackages() {
		var container = document.getElementById("packages");
		container.innerHTML = "";

		package_data.forEach(package => {
			var html = `<package-item type="${package.Description}" descr="${package.OpenComment}" />`;
			var node = document.createRange().createContextualFragment(html);
			container.appendChild(node);
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

			var imgContainer = document.createElement('div');
			imgContainer.setAttribute('class', 'image');

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
				case 'Fedex':
					img.src = 'images/pkg_FedEx.png';
					break;
				default:
					img.src = 'images/pkg_Package.png';
			}
			imgContainer.appendChild(img);
			container.appendChild(imgContainer);

			var style = document.createElement('style');
			style.textContent = `.package {
					width: 32px;
					margin: auto;
					margin-bottom: 1em;
				}

				.image {
					display: block;
				}`;

			shadow.appendChild(style);
			shadow.appendChild(container);
		}
	}

	customElements.define('package-item', PackageElement);

	function SetupHTML() {
		let node = document.createElement('div');
		node.setAttribute('id', 'packages');
		document.body.appendChild(node);
	}

	var PackageWorker;
	return {
		Init: function () {
			document.addEventListener('redrawPackages', RedrawPackages);

			PackageWorker = new Worker('js/packages/packages_bg.js');
			PackageWorker.onmessage = (data => {
				package_data = data.data;
				document.dispatchEvent(redrawPackages);
			});

			SetupHTML();
		},
		Start: function () {
			oAuth.GetAuthToken(BuildingLink, 'api_identity event_log_resident_read')
				.then(token => PackageWorker.postMessage(token));
		}
	};
}());