TouchUI.prototype.core.bridge = function() {
	var self = this;
	var allViewModels = {};

	this.core.bridge = {

		domLoading: function() {
			if (self.isActive()) {
				self.scroll.beforeLoad.call(self);
				self.DOM.init.call(self);
			}
		},

		domReady: function() {
			if (self.isActive()) {
				self.components.dropdown.init.call(self);
				self.components.fullscreen.init.call(self);
				self.components.keyboard.init.call(self);
				self.components.modal.init.call(self);
				self.components.touchList.init.call(self);
				self.components.slider.init.call(self);

				self.scroll.init.call(self);
			}
		},

		koStartup: function TouchUIViewModel(viewModels) {
			allViewModels = _.object(TOUCHUI_REQUIRED_VIEWMODELS, viewModels);
			self.knockout.isLoading.call(self, allViewModels);
			return self;
		}
	}

	// Subscribe to OctoPrint events
	self.onStartupComplete = function () {
		if (self.isActive()) {
			self.DOM.overwrite.tabbar.call(self);
		}
		self.knockout.isReady.call(self, allViewModels);
		if (self.isActive()) {
			self.plugins.init.call(self, allViewModels);
		}
	}

	self.onBeforeBinding = function() {
		ko.mapping.fromJS(allViewModels.settingsViewModel.settings.plugins.touchui, {}, self.settings);
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

	return this.core.bridge;
}
