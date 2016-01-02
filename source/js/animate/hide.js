TouchUI.prototype.animate.hide = function(what) {
	var self = this;

	//Lets hide the navbar by scroll
	if( what === "navbar" ) {
		if( this.animate.isHidebarActive() ) {
			var navbar = $("#navbar"),
				navbarHeight = parseFloat(navbar.height());

			if( this.isTouch ) {
				// Hide navigation bar on mobile
				window.scrollTo(0,1);

				if(parseFloat($("html,body").prop('scrollHeight')) > ($(window).height() + navbarHeight)) {//hasEnoughScroll?
					$("html,body").stop().animate({
						scrollTop: navbarHeight
					}, 160, "swing");
				}

			} else {
				var scroll = self.scroll.iScrolls.body;

				if(scroll.isAnimating) {
					setTimeout(function() {
						self.animate.hide.call(self, what);
					}, 10);
					return;
				}

				setTimeout(function() {
					if(Math.abs(scroll.maxScrollY) > 0) {
						scroll.scrollTo(0, -navbarHeight, 160);
					}
				}, 0);

			}
		}
	}

}
