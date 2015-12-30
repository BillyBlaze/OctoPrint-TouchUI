$(function() {
	var Touch = new TouchUI();
	Touch.domLoading();

	function touchUIViewModel(viewModels) {
		var self = this;

		self.isUIActive = Touch.isActive;
		self.isKeyboardActive = ko.observable(Touch.isKeyboardActive);
		self.isHidebarActive = ko.observable(Touch.isHidebarActive);
		self.isFullscreen = ko.observable(Touch.isFullscreen);

		self.settingsUpdated = ko.observable(false);
		self.touchuiModal = $('#touchui_settings_dialog');
		self.settings = {
			error: ko.observable(false),
			whatsNew: ko.observable(false)
		};

		Touch.koLoading(self, viewModels);

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

		self.show = function() {
			self.touchuiModal.modal("show");
		}

		self.toggleTouchUI = function() {
			Touch.toggleTouch();
		}
		self.toggleKeyboard = function() {
			if(self.isUIActive) {
				self.isKeyboardActive(Touch.toggleKeyboard());
			}
		}
		self.toggleHidebar = function() {
			if(self.isUIActive) {
				self.isHidebarActive(Touch.toggleHidebar());
			}
		}
		self.toggleFullscreen = function() {
			Touch.toggleFullscreen();
		}

		self.onEventSettingsUpdated = function() {
			console.log("onEventSettingsUpdated");
			self.settingsUpdated(true);
		}

	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel", "controlViewModel", "gcodeFilesViewModel", "navigationViewModel", "pluginManagerViewModel", "temperatureViewModel"],
		["#touchui_settings_dialog", "#settings_plugin_touchui", "#navbar_plugin_touchui"]
	]);
});
