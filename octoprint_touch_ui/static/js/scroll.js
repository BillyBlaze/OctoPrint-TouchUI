window.TouchUI = window.TouchUI || {};
window.TouchUI.scroll = {
	
	init: function() {

		/* Add body scrolling on mousedown if there is no touch events */
		if (!('ontouchstart' in window) && !('onmsgesturechange' in window)) {
			
			// Set overflow hidden for best performance
			$('body,html').css('overflow', 'hidden');
			
			var scroll = new IScroll('#scroll', {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: 'scale',
				fadeScrollbars: true
			});
			
			$('#tabs [data-toggle="tab"]').on("click", function() {
				scroll.stop();
				scroll.refresh();
				
				// TODO: Make this a setting in the options
				setTimeout(function() {
					scroll.scrollTo(0, -parseFloat($("#navbar").height()), 160);
					setTimeout(function() {
						scroll.refresh();
					}, 180);//crappy iScroll
				}, 100);

			});
			
			//Setup scroll events in modal
			this.modal.init.call(this);
			
		} else {
			
			/* Hide topbar if clicking an item */
			// TODO: Make this a setting in the options
			$('#tabs [data-toggle="tab"]').click(function() {
				$("html, body").stop().animate({scrollTop:parseFloat($("#navbar").height())}, 160, 'swing');
			});
			
		}
	},
	
	modal: {
		init: function() {
			
			$(document).on('show.modalmanager', function(e) {
				var el = $(e.target);
				
				var scrolls = new IScroll(el.parent()[0], {
					scrollbars: true,
					mouseWheel: true,
					interactiveScrollbars: true,
					shrinkScrollbars: 'scale'
				});
				
				setTimeout(function() {
					scrolls.refresh();
				}, 100);
				
				setTimeout(function() {
					scrolls.refresh();
				}, 300);
			
				scrolls.on('scrollStart', function() {
					window.TouchUI.blockDropdownFromClosing = true;
					el.addClass("no-pointer");
				});
				scrolls.on("scrollEnd", function(e) {
					setTimeout(function() {
						el.removeClass("no-pointer");
					}, 50);
				});
				
				el.find('[data-toggle="tab"]').on("click", function(e) {
					e.preventDefault();
					scrolls.refresh();
					scrolls.scrollTo(0, 0);
					
					setTimeout(function() {
						scrolls.refresh();
					}, 100);
					
				});
				
				var tmp;
				$(document).on("dropdown-is-open", function(e, elm) {

					tmp = new IScroll(elm, {
						scrollbars: true,
						mouseWheel: true,
						interactiveScrollbars: true,
						shrinkScrollbars: 'scale'
					});
					scrolls.disable();
					
					tmp.on("scrollStart", function(e) {
						$(elm).addClass("no-pointer");
					});
					tmp.on("scrollEnd", function(e) {
						setTimeout(function() {
							$(elm).removeClass("no-pointer");
						}, 50);
					});
					
				});
				$(document).on("dropdown-is-closed", function() {
					scrolls.enable();
				});
				
				$(document).one('hide.modalmanager', function() {
					el.find('[data-toggle="tab"]').off("click");
					scrolls.destroy();
				});
				
			});
			
		}
	},
};