TouchUI.prototype.plugins.webcamTab = function() {

	_.remove(OCTOPRINT_VIEWMODELS, function(obj) {
		if (obj && obj.construct && obj.construct.name && obj.construct.name === "WebcamTabViewModel") {
			console.info("TouchUI: WebcamTab is disabled while TouchUI is active.");
			$('#tab_plugin_webcamtab_link, #tab_plugin_webcamtab').remove();
			return true;
		}
		
		return false;
	});

}
