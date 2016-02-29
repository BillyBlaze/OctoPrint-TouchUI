!function() {

	var Touch = new TouchUI();
	Touch.domLoading();

	$(function() {
		TOUCHUI_REQUIRED_VIEWMODELS = [
			"terminalViewModel",
			"connectionViewModel",
			"settingsViewModel",
			"softwareUpdateViewModel",
			"controlViewModel",
			"gcodeFilesViewModel",
			"navigationViewModel",
			"pluginManagerViewModel",
			"temperatureViewModel",
			"loginStateViewModel"
		];

		if(_.some(OCTOPRINT_VIEWMODELS, function(v) { return v[2] === "#gcode"; })) {
			TOUCHUI_REQUIRED_VIEWMODELS = TOUCHUI_REQUIRED_VIEWMODELS.concat(["gcodeViewModel"]);
		}

		Touch.domReady();

		OCTOPRINT_VIEWMODELS.push([
			Touch.koStartup,
			TOUCHUI_REQUIRED_VIEWMODELS,
			["#touchui_settings_dialog", "#settings_plugin_touchui", "#navbar_plugin_touchui"],
			TOUCHUI_REQUIRED_VIEWMODELS
		]);
	});

}();
