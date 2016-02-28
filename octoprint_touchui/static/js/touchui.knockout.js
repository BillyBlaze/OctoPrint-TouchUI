(function() {

	var Touch = new TouchUI();
	Touch.domLoading();

	$(function() {
		var TOUCHUI_REQUIRED_VIEWMODELS = [
			"terminalViewModel",
			"connectionViewModel",
			"settingsViewModel",
			"softwareUpdateViewModel",
			"controlViewModel",
			"gcodeFilesViewModel",
			"navigationViewModel",
			"pluginManagerViewModel",
			"temperatureViewModel",
			"loginStateViewModel"
		];

		Touch.domReady(self);

		function TouchUIViewModel (viewModels) {
			var self = this,
				allViewModels = {};

			allViewModels = _.object(TOUCHUI_REQUIRED_VIEWMODELS, viewModels);

			self.isActive = Touch.isActive;
			self.isKeyboardActive = Touch.isKeyboardActive;
			self.isHidebarActive = Touch.isHidebarActive;
			self.isFullscreen = Touch.isFullscreen;
			self.hasFullscreen = Touch.hasFullscreen;
			self.isTouchscreen = Touch.isTouchscreen;
			self.hasTouch = Touch.hasTouch;

			self.settings = {
				whatsNew: ko.observable(false)
			}

			self.onStartupComplete = function () {
				Touch.koReady(self, allViewModels);
			}

			self.onBeforeBinding = function() {
				ko.mapping.fromJS(allViewModels.settingsViewModel.settings.plugins.touchui, {}, self.settings);
			}

			self.toggleTouchUI = Touch.toggleTouch;
			self.toggleKeyboard = Touch.toggleKeyboard;
			self.toggleHidebar = Touch.toggleHidebar;
			self.toggleFullscreen = Touch.toggleFullscreen;
			self.toggleTouchscreen = Touch.toggleTouchscreen;
			self.onTabChange = Touch.onTabChange;
			self.show = Touch.show;

			self.onSettingsBeforeSave = function() {
				Touch.saveLESS.call(Touch, self);
			}

			Touch.koLoading(self, allViewModels);

		}

		OCTOPRINT_VIEWMODELS.push([
			TouchUIViewModel,
			TOUCHUI_REQUIRED_VIEWMODELS,
			["#touchui_settings_dialog", "#settings_plugin_touchui", "#navbar_plugin_touchui"],
			TOUCHUI_REQUIRED_VIEWMODELS
		]);
	});

}());
