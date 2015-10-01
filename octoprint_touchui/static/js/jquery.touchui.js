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
			domLoading: function(/*touchViewModel*/) {
				if(self.isActive) {
					self.overwrite.init.call(self);
				}
			},
			koLoading: function(touchViewModel, viewModels) {
				if(self.isActive) {
					self.knockout.beforeLoad.call(self, viewModels);
				}
			},
			koReady: function(touchViewModel, viewModels) {
				if(self.isActive) {
					self.modal.init.call(self);
					self.slider.init.call(self);
					self.files.init.call(self);
					self.scroll.init.call(self);;
					self.keyboard.init.call(self);

					self.knockout.isReady.call(self, viewModels);
				}
			}
		};
	};

	TouchUInstance.prototype = $.extend({
		constructor: TouchUInstance,

		id: "touch",
		version: 0,
		isActive: false,
		isTouch: ("ontouchstart" in window || "onmsgesturechange" in window),

		hiddenClass: "hidden_touch",
		visibleClass: "visible_touch"

	}, $.fn.TouchUI);

	$.fn.TouchUI = function() {
		return new TouchUInstance();
	};
	$.fn.TouchUI.Constructor = TouchUInstance;

}(window.jQuery);
