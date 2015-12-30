TouchUI.prototype.scroll.terminal = {

	init: function() {
		var self = this;

		// Create scrolling for terminal
		self.scroll.iScrolls.terminal = new IScroll("#terminal-scroll", self.scroll.defaults.iScroll);

		// Enforce the right scrollheight and disable main scrolling if we have a scrolling content
		self.scroll.iScrolls.terminal.on("beforeScrollStart", function() {
			self.scroll.iScrolls.terminal.refresh();

			if(this.hasVerticalScroll) {
				self.scroll.iScrolls.body.disable();
			}
		});
		self.scroll.iScrolls.terminal.on("scrollEnd", function() {
			self.scroll.iScrolls.body.enable();
		});

	}
}
