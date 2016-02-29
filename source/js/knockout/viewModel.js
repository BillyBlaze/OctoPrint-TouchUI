TouchUI.prototype.knockout.viewModel = function() {
	var self = this;

	// Subscribe to OctoPrint events
	self.onStartupComplete = function () {
		if (self.isActive()) {
			self.DOM.overwrite.tabbar.call(self);
		}
		self.knockout.isReady.call(self, self.core.bridge.allViewModels);
		if (self.isActive()) {
			self.plugins.init.call(self, self.core.bridge.allViewModels);
		}
	}

	self.onBeforeBinding = function() {
		ko.mapping.fromJS(self.core.bridge.allViewModels.settingsViewModel.settings.plugins.touchui, {}, self.settings);
	}

	self.onSettingsBeforeSave = function() {
		self.core.less.save.call(self);
	}

	self.onTabChange = function() {
		if (self.isActive()) {
			self.animate.hide.call(self, "navbar");

			if(!self.settings.hasTouch && self.scroll.currentActive) {
				self.scroll.currentActive.refresh();
				setTimeout(function() {
					self.scroll.currentActive.refresh();
				}, 0);
			}
		}
	}

}
