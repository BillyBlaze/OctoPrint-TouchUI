$(function() {
	var Touch = new TouchUI();
	Touch.domLoading();

	$(window).ready(function() {
		Touch.domReady(self);
	});

	function touchUIViewModel(viewModels) {
		var self = this;

		self.isActive = Touch.isActive;
		self.isKeyboardActive = Touch.isKeyboardActive;
		self.isHidebarActive = Touch.isHidebarActive;
		self.isFullscreen = Touch.isFullscreen;

		self.settingsUpdated = ko.observable(false);
		self.touchuiModal = $('#touchui_settings_dialog');
		self.settings = {
			error: ko.observable(false),
			whatsNew: ko.observable(false)
		};

		self.onStartupComplete = function() {
			Touch.koReady(self, viewModels);
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
		self.onTabChange = Touch.onTabChange;

		self.show = function() {
			self.touchuiModal.modal("show");
		}

		self.onEventSettingsUpdated = function() {
			self.settingsUpdated(true);
		}

	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel", "controlViewModel", "gcodeFilesViewModel", "navigationViewModel", "pluginManagerViewModel", "temperatureViewModel"],
		["#touchui_settings_dialog", "#settings_plugin_touchui", "#navbar_plugin_touchui"]
	]);
});
