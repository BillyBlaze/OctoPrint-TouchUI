$(function() {

	function touchUIViewModel(viewModels) {
		var self = this;
		
		self.toggleTouchUI = function() {
			
		};
		
		self.onStartupComplete = function() {
			
			/* Setup modules */
			window.TouchUI.modal.init();
			window.TouchUI.keyboard.init();
			window.TouchUI.slider.init();
			window.TouchUI.files.init();
			window.TouchUI.scroll.init();

			window.TouchUI.main.knockout.isReady(viewModels);
		};
		
	}
	
	window.TouchUI.main.init();
	window.TouchUI.modal.connection.init();
	window.TouchUI.main.knockout.beforeLoad();

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel"],
		"#settings_plugin_touch_ui"
	]);

});