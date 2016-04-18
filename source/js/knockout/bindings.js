TouchUI.prototype.knockout.bindings = function() {
	var self = this;

	this.bindings = {

		toggleTouch: function() {
			if (self.DOM.storage.toggleBoolean("active")) {
				document.location.hash = "#touch";
			} else {
				document.location.hash = "";
			}
			document.location.reload();
		},

		toggleKeyboard: function() {
			if (self.isActive()) {
				self.settings.isKeyboardActive(self.DOM.storage.toggleBoolean("keyboardActive"));
			}
		},

		toggleHidebar: function() {
			if (self.isActive()) {
				self.settings.isHidebarActive(self.DOM.storage.toggleBoolean("hideNavbarActive"));
			}
		},

		toggleFullscreen: function() {
			$(document).toggleFullScreen();
		},

		toggleTouchscreen: function() {
			if (self.isActive()) {
				self.settings.isTouchscreen(self.DOM.storage.toggleBoolean("touchscreenActive"));
				document.location.reload();
			}
		},

		show: function() {
			self.settings.touchuiModal.modal("show");
		}

	}

}
