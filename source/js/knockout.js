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
			"temperatureViewModel"
		];

		Touch.domReady(self);

		function touchUIViewModel(viewModels) {
			var self = this,
				allViewModels = {};

			_.each(viewModels, function(obj, key) {
				allViewModels[TOUCHUI_REQUIRED_VIEWMODELS[key]] = obj;
			});

			self.isActive = Touch.isActive;
			self.isKeyboardActive = Touch.isKeyboardActive;
			self.isHidebarActive = Touch.isHidebarActive;
			self.isFullscreen = Touch.isFullscreen;
			self.isTouchscreen = Touch.isTouchscreen;
			self.isTouch = Touch.isTouch;

			self.settings = {
				requireNewCSS: ko.observable(false),
				whatsNew: ko.observable(false)
			};

			self.onStartupComplete = function() {
				Touch.koReady(self, allViewModels);
			}

			self.onBeforeBinding = function() {
				_.each(viewModels[2].settings.plugins.touchui, function(newSetting, key) {
					if(ko.isObservable(self.settings[key])) {
						newSetting.subscribe(function(val) {
							self.settings[key](val);
						});
						newSetting.valueHasMutated();
					} else {
						self.settings[key] = newSetting;
					}
				});
			}

			self.toggleTouchUI = Touch.toggleTouch;
			self.toggleKeyboard = Touch.toggleKeyboard;
			self.toggleHidebar = Touch.toggleHidebar;
			self.toggleFullscreen = Touch.toggleFullscreen;
			self.toggleTouchscreen = Touch.toggleTouchscreen;
			self.onTabChange = Touch.onTabChange;
			self.show = Touch.show;

			self.onEventSettingsUpdated = function() {
				Touch.saveLESS.call(Touch, self);
			}

			Touch.koLoading(self, allViewModels);

		}

		OCTOPRINT_VIEWMODELS.push([
			touchUIViewModel,
			TOUCHUI_REQUIRED_VIEWMODELS,
			["#touchui_settings_dialog", "#settings_plugin_touchui", "#navbar_plugin_touchui"]
		]);
	});

}());
