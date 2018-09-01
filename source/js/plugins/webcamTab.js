TouchUI.prototype.plugins.webcamTab = function() {

	_.remove(OCTOPRINT_VIEWMODELS, function(obj) {
		if (obj[0] && obj[0].construct && obj[0].construct.name === "WebcamTabViewModel") {
			console.info("TouchUI: WebcamTab is disabled while TouchUI is active.");
			return true;
		}
		
		return false;
	});

}
