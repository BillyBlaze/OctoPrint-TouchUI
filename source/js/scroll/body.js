TouchUI.prototype.scroll.body = {

	init: function() {
		var self = this,
			scrollStart = false,
			$noPointer = $('.page-container');

		// Create main body scroll
		self.scroll.iScrolls.body = new IScroll("#scroll", self.scroll.defaults.iScroll);
		self.scroll.currentActive = self.scroll.iScrolls.body;

		// Block everthing while scrolling
		var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $noPointer, self.scroll.iScrolls.body),
			scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $noPointer, self.scroll.iScrolls.body);

		// Disable all JS events while scrolling for best performance
		self.scroll.iScrolls.body.on("scrollStart", scrollStart);
		self.scroll.iScrolls.body.on("onBeforeScrollStart", scrollStart);
		self.scroll.iScrolls.body.on("scrollEnd", scrollEnd);
		self.scroll.iScrolls.body.on("scrollCancel", scrollEnd);

		// Prevent any misfortune
		$(document).on("mouseup.prevent.pointer touchend.prevent.pointer", function() {
			$noPointer.removeClass('no-pointer');
		});

	}

}
