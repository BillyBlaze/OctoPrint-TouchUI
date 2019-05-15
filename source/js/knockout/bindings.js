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
				self.components.keyboard.isActive(self.DOM.storage.toggleBoolean("keyboardActive"));
			}
		},

		toggleHidebar: function() {
			if (self.isActive()) {
				self.animate.isHidebarActive(self.DOM.storage.toggleBoolean("hideNavbarActive"));
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
			$('#touchui_settings_dialog').modal("show");
		}

	}

}
