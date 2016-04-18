TouchUI.prototype.scroll.body = {

	init: function() {
		var self = this;
		var scrollStart = false;

		// Create main body scroll
		self.scroll.iScrolls.body = new IScroll(".octoprint-container", self.scroll.defaults.iScroll);
		self.scroll.iScrolls.menu = new IScroll("#all_touchui_settings .dropdown-menu", self.scroll.defaults.iScroll);
		self.scroll.currentActive = self.scroll.iScrolls.body;

		_.each([self.scroll.iScrolls.body, self.scroll.iScrolls.menu], function(iScroll) {
			var $noPointer = $(iScroll.wrapper);

			// Block everthing while scrolling
			var scrollStart = self.scroll.blockEvents.scrollStart.bind(self, $noPointer, iScroll),
				scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self, $noPointer, iScroll);

			// Disable all JS events while scrolling for best performance
			iScroll.on("scrollStart", scrollStart);
			iScroll.on("onBeforeScrollStart", scrollStart);
			iScroll.on("scrollEnd", scrollEnd);
			iScroll.on("scrollCancel", scrollEnd);

		});

		// Prevent any misfortune
		$(document).on("mouseup.prevent.pointer touchend.prevent.pointer", function() {
			$('.no-pointer').removeClass('no-pointer');
		});

	}

}
