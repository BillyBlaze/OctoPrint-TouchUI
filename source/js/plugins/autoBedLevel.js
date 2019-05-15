TouchUI.prototype.plugins.autoBedLevel = function() {

	_.remove(OCTOPRINT_VIEWMODELS, function(obj) {
		if (obj && obj.construct && obj.construct.name && obj.construct.name === "AblExpertViewModel") {
			console.info("TouchUI: AblExpert is disabled while TouchUI is active.");

			$('#settings_plugin_ABL_Expert').hide();
			$('#settings_plugin_ABL_Expert_link').hide();
			$('#processing_dialog_plugin_ABL_Expert').hide();
			$('#results_dialog_plugin_ABL_Expert').hide();

			return true;
		}
		
		return false;
	});
}
