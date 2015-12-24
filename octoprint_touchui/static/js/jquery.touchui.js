!function ($) {

	var TouchUInstance = function() {
		var self = this;

		this.DOM.pluginLoaded.call(this);

		return {
			_instance: this,

			isActive: this.isActive,
			isKeyboardActive: this.keyboard.isActive,
			isHidebarActive: this.animate.isHidebarActive,

			toggleTouch: function() {
				if(self.DOM.cookies.toggleBoolean("active")) {
					document.location.hash = "#touch";
				} else {
					document.location.hash = "";
				}
				document.location.reload();
			},
			toggleKeyboard: function() {
				return self.keyboard.isActive = self.DOM.cookies.toggleBoolean("keyboardActive");
			},
			toggleHidebar: function() {
				return self.animate.isHidebarActive = self.DOM.cookies.toggleBoolean("hideNavbarActive");
			},
			toggleFullscreen: function() {
				$(document).toggleFullScreen();
			},
			domLoading: function(/*touchViewModel*/) {
				if(self.isActive) {
					self.overwrite.init.call(self);
				}
			},
			koLoading: function(touchViewModel, viewModels) {
				if(self.isActive) {
					self.knockout.beforeLoad.call(self, touchViewModel, viewModels);
				}
			},
			koReady: function(touchViewModel, viewModels) {
				if(self.isActive) {
					self.files.init.call(self);
					self.modal.init.call(self);
					self.slider.init.call(self);
					self.scroll.init.call(self);
					self.keyboard.init.call(self);

					self.settings = touchViewModel.settings || {};
					self.knockout.isReady.call(self, touchViewModel, viewModels);
					self.plugins.init.call(self, touchViewModel, viewModels);
				}
			}
		};
	};

	TouchUInstance.prototype = $.extend({
		constructor: TouchUInstance,

		id: "touch",
		version: 0,
		isActive: false,
		isTouch: (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
		isFullscreen: false,
		canLoadAutomatically: $("#loadsomethingsomethingdarkside").length > 0,

		hiddenClass: "hidden_touch",
		visibleClass: "visible_touch"

	}, $.fn.TouchUI);

	$.fn.TouchUI = function() {
		return new TouchUInstance();
	};
	$.fn.TouchUI.Constructor = TouchUInstance;

}(window.jQuery);
