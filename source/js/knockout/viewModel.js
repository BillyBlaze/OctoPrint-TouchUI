TouchUI.prototype.knockout.viewModel = function() {
	var self = this;

	// Subscribe to OctoPrint events
	self.onStartupComplete = function () {
		self.knockout.isReady.call(self, self.core.bridge.allViewModels);
		if (self.isActive()) {
			self.DOM.overwrite.tabbar.call(self);
			self.plugins.init.call(self, self.core.bridge.allViewModels);
		};
	}

	self.onBeforeBinding = function() {
		ko.mapping.fromJS(self.core.bridge.allViewModels.settingsViewModel.settings.plugins.touchui, {}, self.settings);
	}

	self.onSettingsBeforeSave = function() {
		self.core.less.save.call(self);
	}

	self.onTabChange = function() {
		if (self.isActive()) {
			$('#fab').removeClass('show');
			self.DOM.pool.add(function() {

				if(!self.settings.hasTouch && self.scroll.currentActive) {
					self.scroll.refresh(self.scroll.currentActive);
					setTimeout(function() {
						self.scroll.refresh(self.scroll.currentActive);
					}, 10);
				}
			});
		}
	}

}
