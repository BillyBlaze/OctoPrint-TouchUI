TouchUI.prototype.core.bridge = function() {
	var self = this;

	return {
		_instance: this,

		isActive: this.isActive,
		isKeyboardActive: this.components.keyboard.isActive,
		isHidebarActive: this.animate.isHidebarActive,
		isFullscreen: this.isFullscreen,

		domLoading: function() {
			if(self.isActive()) {
				self.scroll.beforeLoad.call(self);
				self.DOM.init.call(self);
				self.DOM.overwrite.tabdrop.call(self);
				self.DOM.overwrite.modal.call(self);
			}
		},

		domReady: function() {
			if(self.isActive()) {
				self.components.dropdown.init.call(self);
				self.components.fullscreen.init.call(self);
				self.components.keyboard.init.call(self);
				self.components.modal.init.call(self);
				self.components.touchList.init.call(self);

				self.scroll.init.call(self);
			}
		},

		koReady: function(touchViewModel, viewModels) {
			if(self.isActive()) {
				self.components.slider.init.call(self);
				self.DOM.overwrite.tabbar.call(self);

				self.settings = touchViewModel.settings || {};
				self.knockout.isReady.call(self, touchViewModel, viewModels);
				self.plugins.init.call(self, touchViewModel, viewModels);
			}
		},

		toggleTouch: function() {
			if(self.DOM.cookies.toggleBoolean("active")) {
				document.location.hash = "#touch";
			} else {
				document.location.hash = "";
			}
			document.location.reload();
		},

		toggleKeyboard: function() {
			if(self.isActive()) {
				self.components.keyboard.isActive(self.DOM.cookies.toggleBoolean("keyboardActive"));
			}
		},

		toggleHidebar: function() {
			if(self.isActive()) {
				self.animate.isHidebarActive(self.DOM.cookies.toggleBoolean("hideNavbarActive"));
			}
		},

		toggleFullscreen: function() {
			$(document).toggleFullScreen();
		},

		onTabChange: function() {
			if(self.isActive()) {
				if( !self.isTouch ) {
					if(self.scroll.currentActive) {
						self.animate.hide.call(self, "navbar");
						self.scroll.currentActive.refresh();
						setTimeout(function() {
							self.scroll.currentActive.refresh();
						}, 0);
					}
				}
			}
		}

	};

}
