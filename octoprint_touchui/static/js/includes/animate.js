!function ($) {

	$.fn.TouchUI.animate = {

		isHidebarActive: false,
		hide: function(whatEl) {
			var self = this;

			//Lets hide the navbar by scroll
			if(whatEl === "navbar") {
				if(this.animate.isHidebarActive) {
					var navbar = $("#navbar"),
						navbarHeight = parseFloat(navbar.height());

					if(this.isTouch) {
						// Hide navigation bar on mobile
						window.scrollTo(0,1);

						if(parseFloat($("html,body").prop('scrollHeight')) > ($(window).height() + navbarHeight)) {//hasEnoughScroll?
							$("html,body").stop().animate({
								scrollTop: navbarHeight
							}, 160, "swing");
						}

					} else {

						self.scroll.iScrolls.body.refresh();
						if(self.scroll.iScrolls.body.maxScrollY < -navbarHeight) {
							self.scroll.iScrolls.body.stop();

							setTimeout(function() {
								self.scroll.iScrolls.body.refresh();
								self.scroll.iScrolls.body.scrollTo(0, -navbarHeight, 160);
							}, 0);
						}
					}
				} else {

					if(!this.isTouch) {
						setTimeout(function() {
							self.scroll.iScrolls.body.refresh();
						}, 0);
					}

				}
			}
		}

	};

}(window.jQuery);
