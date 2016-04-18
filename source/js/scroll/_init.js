TouchUI.prototype.scroll.init = function() {
	var self = this;

	if ( !this.settings.hasTouch ) {

		// Set overflow hidden for best performance
		$("html").addClass("emulateTouch");

		self.DOM.pool.add(function() {
			self.scroll.terminal.init.call(self);
			self.scroll.body.init.call(self);
			self.scroll.modal.init.call(self);
			self.scroll.overlay.init.call(self);
		});

		$(document).on("slideCompleted", function() {
			self.scroll.refresh(self.scroll.currentActive);
		});

		// Refresh body on dropdown click
		$(document).on("click", ".pagination ul li a", function() {
			setTimeout(function() {
				self.scroll.refresh(self.scroll.currentActive);
			}, 0);
		});

	}

}
