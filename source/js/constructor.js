var TouchUI = function() {
	this.core.init.call(this);
	return this.core.bridge.call(this);
};

TouchUI.prototype = {
	id: "touch",
	version: 0,

	isActive: ko.observable(false),
	isFullscreen: ko.observable(false),
	hasFullscreen: ko.observable(document.webkitCancelFullScreen || document.msCancelFullScreen || document.oCancelFullScreen || document.mozCancelFullScreen || document.cancelFullScreen),

	isTouch: (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
	isTouchscreen: ko.observable(false),
	canLoadAutomatically: $("#loadsomethingsomethingdarkside").length > 0,

	hiddenClass: "hidden_touch",
	visibleClass: "visible_touch",

	constructor: TouchUI,
	touchuiModal: $('#touchui_settings_dialog'),

	core: {},
	components: {},
	knockout: {},
	plugins: {},
	animate: {
		isHidebarActive: ko.observable(false)
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
