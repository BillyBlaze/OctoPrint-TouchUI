window.TouchUI = window.TouchUI || {};
window.TouchUI.animate = {
	
	hide: function(whatEl) {
		
		//Lets hide the navbar by scroll
		if(whatEl === "navbar") {
			var navbar = $("#navbar"),
				navbarHeight = parseFloat(navbar.height());
			
			if(window.TouchUI.isTouch) {
				
				if(parseFloat($("html,body").prop('scrollHeight')) > ($(window).height() + navbarHeight)) {//hasEnoughScroll?
					$("html,body").stop().animate({
						scrollTop: navbarHeight
					}, 160, "swing");
				}
				
			} else {
				var self = window.TouchUI.scroll;
				
				if(self.iScrolls.body.maxScrollY < -160) {
					self.iScrolls.body.stop();
					
					setTimeout(function() {
						self.iScrolls.body.refresh();
						self.iScrolls.body.scrollTo(0, -navbarHeight, 160);
					}, 0);
				}
			}
		}
		
	}
	
};