$(function() {
	var TouchUI = $(document).TouchUI();

	TouchUI.domLoading();

	function touchUIViewModel(viewModels) {
		var self = this;

		TouchUI.koLoading(self, viewModels);

		self.isUIActive = TouchUI.isActive;
		self.isKeyboardActive = ko.observable(TouchUI.isKeyboardActive);
		self.isHidebarActive = ko.observable(TouchUI.isHidebarActive);
		self.isFullscreen = ko.observable(TouchUI.isFullscreen);

		self.toggleTouchUI = function() {
			TouchUI.toggleTouch();
		}
		self.toggleKeyboard = function() {
			if(self.isUIActive) {
				self.isKeyboardActive(TouchUI.toggleKeyboard());
			}
		}
		self.toggleHidebar = function() {
			if(self.isUIActive) {
				self.isHidebarActive(TouchUI.toggleHidebar());
			}
		}
		self.toggleFullscreen = function() {
			TouchUI.toggleFullscreen();
		}

		self.onStartupComplete = function() {
			TouchUI.koReady(self, viewModels);
		}

		self.showUserSettings = function() {
			viewModels[6].usersettings.show();
			$("#usersettings_plugin_touchui_link a").trigger("click");
			$("#special-dropdown-uni-2").trigger("click");
		}

	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel", "controlViewModel", "gcodeFilesViewModel", "navigationViewModel"],
		["#usersettings_plugin_touchui", "#settings_plugin_touchui"]
	]);
});
