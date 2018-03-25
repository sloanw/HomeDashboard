window.onload = function () {
	for (ModuleName in Modules) {
		let Module = Modules[ModuleName];
		Module.Init();
	}
};