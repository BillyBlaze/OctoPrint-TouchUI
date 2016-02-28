var TouchUI = function() {
	this.core.init.call(this);
	return this.core.bridge.call(this);
};

TouchUI.prototype = {
	id: "touch",
	version: 0,

	isActive: ko.observable(false),
	isFullscreen: ko.observable(false),
	isTouchscreen: ko.observable(false),
	isEpiphanyOrKweb: (window.navigator.userAgent.indexOf("AppleWebKit") !== -1 && window.navigator.userAgent.indexOf("ARM Mac OS X") !== -1),

	hasFullscreen: ko.observable(document.webkitCancelFullScreen || document.msCancelFullScreen || document.oCancelFullScreen || document.mozCancelFullScreen || document.cancelFullScreen),
	hasLocalStorage: ('localStorage' in window),
	hasTouch: (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),

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
