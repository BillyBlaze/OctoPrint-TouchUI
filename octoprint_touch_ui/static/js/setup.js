$(function() {

	function touchUIViewModel(parameters) {
		var self = this;
		
		window.TouchUI.main.init();
		
		self.toggleTouchUI = function() {
			
		};
		
		self.onStartupComplete = function() {

			window.TouchUI.main.knockout.isReady.call(this);
			
			/* Setup modules */
			window.TouchUI.modal.init();
			window.TouchUI.keyboard.init();
			window.TouchUI.slider.init();
			window.TouchUI.files.init();
			window.TouchUI.scroll.init();
		};
		
	}
	
	window.TouchUI.main.knockout.beforeLoad();

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["controlViewModel", "connectionViewModel"],
		"#settings_plugin_touch_ui"
	]);

});