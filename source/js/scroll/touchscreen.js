TouchUI.prototype.scroll.touchscreen = {

	init: function() {
		var self = this;
		// Create main body scroll
		self.scroll.iScrolls.touchscreen = new IScroll("#touchui-overlay-animation", self.scroll.defaults.iScroll);

	}

}
