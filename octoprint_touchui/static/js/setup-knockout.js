$(function() {
	var touchUI = false;
	
	if( document.location.hash === "#touch" || window.TouchUI.main.cookies.get("TouchUI") === "true") {
		touchUI = true;
		window.TouchUI.main.init();
	}

	function touchUIViewModel(viewModels) {
		var self = this;
	
		if(touchUI) {
			window.TouchUI.modal.connection.init();
			window.TouchUI.main.knockout.beforeLoad();
		}
		
		self.toggleTouchUI = function() {

			if(window.TouchUI.main.cookies.get("TouchUI") == "true") {
				window.TouchUI.main.cookies.set("TouchUI", "false");
				document.location.hash = "";
			} else {
				window.TouchUI.main.cookies.set("TouchUI", "true");
				document.location.hash = "#touch";
			}

			document.location.reload();
		};
		
		self.onStartupComplete = function() {
				
			if(touchUI) {
				/* Setup modules */
				window.TouchUI.modal.init();
				window.TouchUI.slider.init();
				window.TouchUI.files.init();
				window.TouchUI.scroll.init();
				window.TouchUI.keyboard.init();

				window.TouchUI.main.knockout.isReady(viewModels);
			}
		};
		
	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel"],
		"#settings_plugin_touchui"
	]);
});