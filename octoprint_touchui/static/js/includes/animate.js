!function ($) {

	$.fn.TouchUI.animate = {

		hide: function(whatEl) {

			//Lets hide the navbar by scroll
			if(whatEl === "navbar") {
				var navbar = $("#navbar"),
					navbarHeight = parseFloat(navbar.height());

				if(this.isTouch) {

					if(parseFloat($("html,body").prop('scrollHeight')) > ($(window).height() + navbarHeight)) {//hasEnoughScroll?
						$("html,body").stop().animate({
							scrollTop: navbarHeight
						}, 160, "swing");
					}

				} else {
					var self = this;

					self.scroll.iScrolls.body.refresh();
					if(self.scroll.iScrolls.body.maxScrollY < -navbarHeight) {
						self.scroll.iScrolls.body.stop();

						setTimeout(function() {
							self.scroll.iScrolls.body.refresh();
							self.scroll.iScrolls.body.scrollTo(0, -navbarHeight, 160);
						}, 0);
					}
				}
			}

		}

	};

}(window.jQuery);
