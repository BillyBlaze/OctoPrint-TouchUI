window.TouchUI = window.TouchUI || {};
window.TouchUI.animate = {
	
	hide: function(whatEl) {
		
		//Lets hide the navbar by scroll
		if(whatEl === "navbar") {
			var navbar = $("#navbar");
			
			if(window.TouchUI.isTouch) {
				
				if(parseFloat($("html,body").prop('scrollHeight')) > ($(window).height()+160)) {//haEnoughScroll?
					$("html, body").stop().animate({
						scrollTop: parseFloat(navbar.height())
					}, 160, "swing");
				}
				
			} else {
				var self = window.TouchUI.scroll;
				
				self.iScrolls.body.refresh();
				if(self.iScrolls.body.maxScrollY < -160) {
					self.iScrolls.body.stop();
					
					// Hide topbar if clicking an item 
					// TODO: Make this a setting in the options
					setTimeout(function() {
						self.iScrolls.body.scrollTo(0, -parseFloat(navbar.height()), 160);
						setTimeout(function() {
							self.iScrolls.body.refresh();
						}, 180);//crappy iScroll
					}, 100);
				}
			}
		}
		
	}
	
};