$(function() {
	var TouchUI = $(document).TouchUI();

	TouchUI.domLoading();

	function touchUIViewModel(viewModels) {
		var self = this;

		TouchUI.koLoading(self, viewModels);

		self.toggleTouchUI = function() {
			TouchUI.toggleTouch();
		};

		self.onStartupComplete = function() {
			TouchUI.koReady(self, viewModels);
		};

	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel", "controlViewModel", "gcodeViewModel"],
		"#settings_plugin_touchui"
	]);
});
