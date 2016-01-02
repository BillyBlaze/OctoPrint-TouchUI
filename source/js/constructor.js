var TouchUI = function() {
	this.core.init.call(this);
	return this.core.bridge.call(this);
};

TouchUI.prototype = {
	id: "touch",
	version: 0,

	isActive: ko.observable(false),
	isFullscreen: ko.observable(false),

	isTouch: (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
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
