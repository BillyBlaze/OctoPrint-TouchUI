window.TouchUI = window.TouchUI || {};
window.TouchUI.scroll = {
	
	iScrolls: {},

	init: function() {
		var self = this;

		// Add body scrolling on mousedown if there is no touch events 
		if ("ontouchstart" in window || "onmsgesturechange" in window) {
			
			// Hide topbar if clicking an item 
			// TODO: Make this a setting in the options
			$('#tabs [data-toggle="tab"]').click(function() {
				$("html, body").stop().animate({scrollTop:parseFloat($("#navbar").height())}, 160, "swing");
			});

		} else { //Setup mouse as touch
			
			// Set overflow hidden for best performance
			$("body,html").css("overflow", "hidden");
			
			self.iScrolls.body = new IScroll("#scroll", {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true
			});
			
			var cont = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
			$("#terminal-output").appendTo(cont);
			self.iScrolls.terminal = new IScroll("#terminal-scroll", {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true
			});
			self.iScrolls.terminal.on("beforeScrollStart", function() {
				self.iScrolls.terminal.refresh();
				
				if(this.hasVerticalScroll) {
					self.iScrolls.body.disable();
				}
			});
			self.iScrolls.terminal.on("scrollEnd", function() {
				self.iScrolls.body.enable();
			});
			
			// Prevent dropdowns from closing when scrolling with them
			$(document).on("mousedown", function(e) {
				
				// Add CSS pointer-events: none; to block all JS events
				self.iScrolls.body.on("scrollStart", function() {
					if( $(e.target).parents(".dropdown-menu").length > 0 ) {
						setTimeout(function() {
							$(e.target).parents(".dropdown-menu").addClass("no-pointer");
						}, 50);
					}
				});
				
				// Add CSS pointer-events: all; to renable all JS events
				self.iScrolls.body.on("scrollEnd", function() {
					$(e.target).parents(".dropdown-menu").removeClass("no-pointer");
					
					// Remove the events
					self.iScrolls.body.off("scrollStart")
					self.iScrolls.body.off("scrollEnd")
					
					// Refresh body scroll
					self.iScrolls.body.refresh();
				});
			});
			
			$('#tabs [data-toggle="tab"]').on("click", function() {
				self.iScrolls.body.stop();
				self.iScrolls.body.refresh();
				
				// Hide topbar if clicking an item 
				// TODO: Make this a setting in the options
				setTimeout(function() {
					self.iScrolls.body.scrollTo(0, -parseFloat($("#navbar").height()), 160);
					setTimeout(function() {
						self.iScrolls.body.refresh();
					}, 180);//crappy iScroll
				}, 100);

			});
			
			// Try to bind inputs, textareas and buttons to keyup rather then mousedown
			// Not on selects since we can't cancel the preventDefault
			$('input, textarea, button').on("mousedown", function(e) {
				e.preventDefault();
				
				var scrolled = false;
				self.iScrolls.body.on("scrollStart", function(event) {
					scrolled = true;
				});
				
				$(document).on("mouseup", function(event) {
					
					if($(event.target).parents($(e.delegateTarget)).length > 0 && !scrolled) {
						$(e.delegateTarget).focus().addClass('touch-focus').animate({opacity:1}, 300, function() {
							$(e.delegateTarget).removeClass('touch-focus');
						});
					}
					
					$(document).off(event);
					self.iScrolls.body.off("scrollStart");
				});
				
			});
			
			//Setup scroll events in modal
			this.modal.init.call(this);
			
		}
	},
	
	modal: {
		init: function() {
			var $document = $(document);
			
			$document.on("show.modalmanager", function(e) {
				var $modalElm = $(e.target);
				
				// Create temp iScroll within the modal
				var tmpIScroll = new IScroll($modalElm.parent()[0], {
					scrollbars: true,
					mouseWheel: true,
					interactiveScrollbars: true,
					shrinkScrollbars: "scale"
				});
				
				// Ugly, force iScroll to get the correct scrollHeight
				setTimeout(function() {
					tmpIScroll.refresh();
				}, 100);
				setTimeout(function() {
					tmpIScroll.refresh();
				}, 300);
			
				// Ugly, force iScroll to get the correct scrollHeight
				tmpIScroll.on("scrollStart", function() {
					$modalElm.addClass("no-pointer");
				});
				tmpIScroll.on("scrollEnd", function(e) {
					setTimeout(function() {
						$modalElm.removeClass("no-pointer");
					}, 50);
				});
				
				$modalElm.find('[data-toggle="tab"]').on("click", function(e) {
					e.preventDefault();
					tmpIScroll.refresh();
					tmpIScroll.scrollTo(0, 0);
					
					setTimeout(function() {
						tmpIScroll.refresh();
					}, 100);
					
				});
				
				var tmpIScrollDropdown;
				$document.on("dropdown-is-open", function(e, elm) {

					tmpIScrollDropdown = new IScroll(elm, {
						scrollbars: true,
						mouseWheel: true,
						interactiveScrollbars: true,
						shrinkScrollbars: "scale"
					});
					tmpIScroll.disable();
					
					tmpIScrollDropdown.on("scrollStart", function(e) {
						$(elm).addClass("no-pointer");
					});
					tmpIScrollDropdown.on("scrollEnd", function(e) {
						setTimeout(function() {
							$(elm).removeClass("no-pointer");
						}, 50);
					});
					
				});
				
				$document.on("dropdown-is-closed", function() {
					tmpIScroll.enable();
				});
				
				$document.one("hide.modalmanager", function() {
					$modalElm.find('[data-toggle="tab"]').off("click");
					tmpIScroll.destroy();
				});
				
			});
			
		}
	},
};