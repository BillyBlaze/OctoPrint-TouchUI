TouchUI.prototype.plugins.tempsGraph = function() {
	_.remove(OCTOPRINT_VIEWMODELS, function(obj) {
		if (obj[0] && obj[0].name === "TempsgraphViewModel") {
			console.info("TouchUI: TempsGraph is disabled while TouchUI is active.");
			return true;
		}
		
		return false;
	});

}
