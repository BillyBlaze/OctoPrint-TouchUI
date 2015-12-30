var TouchUI = function() {
	var self = this;

	this.core.isLoading.call(this);

	return {
		_instance: this,

		isActive: this.isActive,
		isKeyboardActive: this.components.keyboard.isActive,
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
			return self.components.keyboard.isActive = self.DOM.cookies.toggleBoolean("keyboardActive");
		},
		toggleHidebar: function() {
			return self.animate.isHidebarActive = self.DOM.cookies.toggleBoolean("hideNavbarActive");
		},
		toggleFullscreen: function() {
			$(document).toggleFullScreen();
		},
		domLoading: function(/*touchViewModel*/) {
			if(self.isActive) {
				self.DOM.overwrite.tabdrop.call(self);
				self.DOM.overwrite.modal.call(self);
			}
		},
		koLoading: function(touchViewModel, viewModels) {
			if(self.isActive) {
				self.knockout.isLoading.call(self, touchViewModel, viewModels);
			}
		},
		koReady: function(touchViewModel, viewModels) {
			if(self.isActive) {
				self.components.touchList.init.call(self);
				self.components.modal.init.call(self);
				self.components.slider.init.call(self);
				self.components.keyboard.init.call(self);
				self.scroll.init.call(self);

				self.settings = touchViewModel.settings || {};
				self.knockout.isReady.call(self, touchViewModel, viewModels);
				self.plugins.init.call(self, touchViewModel, viewModels);
			}
		}
	};
};

TouchUI.prototype = {
	id: "touch",
	version: 0,
	isActive: false,
	isTouch: (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
	isFullscreen: false,
	canLoadAutomatically: $("#loadsomethingsomethingdarkside").length > 0,

	hiddenClass: "hidden_touch",
	visibleClass: "visible_touch",

	constructor: TouchUI,

	/* Placeholders */
	core: {},
	components: {},
	knockout: {},
	plugins: {},
	animate: {
		isHidebarActive: false
	},
	DOM: {
		create: {},
		move: {},
		overwrite: {}
	},
	scroll: {

		defaults: {
			iScroll: {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true,
				disablePointer: true
			}
		},

		iScrolls: {},
		currentActive: null
	}

}
