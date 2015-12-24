$(function() {
	var TouchUI = $(document).TouchUI();
	TouchUI.domLoading();

	function touchUIViewModel(viewModels) {
		var self = this;

		self.isUIActive = TouchUI.isActive;
		self.isKeyboardActive = ko.observable(TouchUI.isKeyboardActive);
		self.isHidebarActive = ko.observable(TouchUI.isHidebarActive);
		self.isFullscreen = ko.observable(TouchUI.isFullscreen);
		self.touchuiModal = $('#touchui_settings_dialog');
		self.settings = {
			error: ko.observable(false),
			whatsNew: ko.observable(false)
		};

		TouchUI.koLoading(self, viewModels);

		self.onStartupComplete = function() {
			TouchUI.koReady(self, viewModels);
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
		["terminalViewModel", "connectionViewModel", "settingsViewModel", "softwareUpdateViewModel", "controlViewModel", "gcodeFilesViewModel", "navigationViewModel", "pluginManagerViewModel", "temperatureViewModel"],
		["#touchui_settings_dialog", "#settings_plugin_touchui", "#navbar_plugin_touchui"]
	]);
});
