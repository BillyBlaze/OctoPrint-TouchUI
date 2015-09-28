!function ($) {

	var TouchUInstance = function() {
		var self = this;

		if( document.location.hash === "#touch" || this.DOM.cookies.get("active") === "true") {
			$("html").attr("id", this.id);

			this.isActive = true;
			this.DOM.cookies.set("active", "true");
		}

		return {
			_instance: this,
			cookies: this.DOM.cookies,
			domLoading: function(/*touchViewModel*/) {
				self.overwrite.init.call(self);
			},
			koLoading: function(/*touchViewModel, viewModels*/) {
				self.knockout.beforeLoad.call(self);
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
