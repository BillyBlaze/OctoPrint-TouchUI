TouchUI.prototype.plugins.themify = function() {

	_.remove(OCTOPRINT_VIEWMODELS, function(obj) {
		if (obj[2] && obj[2].indexOf("#settings_plugin_themeify") !== -1) {
			console.info("TouchUI: Themeify is disabled while TouchUI is active.");
			return true;
		}
		
		return false;
	});

}
