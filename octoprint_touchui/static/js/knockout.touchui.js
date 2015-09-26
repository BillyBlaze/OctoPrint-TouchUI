$(function() {
	var TouchUI = $(document).TouchUI();

	TouchUI.domLoading();

	function touchUIViewModel(viewModels) {
		var self = this;

		TouchUI.koLoading(self, viewModels);

		self.toggleTouchUI = function() {

			if(TouchUI.cookies.get("active") == "true") {
				TouchUI.cookies.set("active", "false");
				document.location.hash = "";
			} else {
				TouchUI.cookies.set("active", "true");
				document.location.hash = "#touch";
			}

			document.location.reload();
		};

		self.onStartupComplete = function() {
			TouchUI.koReady(self, viewModels);
		};

	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel"],
		"#settings_plugin_touchui"
	]);
});
