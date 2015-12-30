TouchUI.prototype.scroll.body = {

	init: function() {
		var self = this,
			scrollStart = false;

		// Create main body scroll
		self.scroll.iScrolls.body = new IScroll("#scroll", self.scroll.defaults.iScroll);
		self.scroll.currentActive = self.scroll.iScrolls.body;

	}

}
