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
		self.touchuiModal = $('#touchui_settings_dialog');
		self.settings = {};

		self.onStartupComplete = function() {
			TouchUI.koReady(self, viewModels);
		}
		self.onBeforeBinding = function () {
			self.settings = viewModels[2].settings.plugins.touchui;
		}

		self.compile = function() {
			TouchUI._instance.less.compile();
		}

		self.show = function() {
			self.touchuiModal.modal("show");
		}

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

	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel", "controlViewModel", "gcodeFilesViewModel", "navigationViewModel", "pluginManagerViewModel"],
		["#touchui_settings_dialog", "#settings_plugin_touchui", "#navbar_plugin_touchui"]
	]);
});
