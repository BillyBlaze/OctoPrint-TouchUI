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
			
			self.create.terminal.call(self);
			self.create.body.call(self);
			
			// Try to bind inputs, textareas and buttons to keyup rather then mousedown
			// Not on selects since we can't cancel the preventDefault
			$('input, textarea, button').on("mousedown", function(e) {
				e.preventDefault();
				
				var scrolled = false;
				self.iScrolls.body.on("scrollStart", function(event) {
					scrolled = true;
				});
				
				$(document).on("mouseup", function(event) {
					
					if(!scrolled && $(event.target).parents($(e.delegateTarget)).length > 0) {
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

	create: {
		
		terminal: function() {
			var self = this;
			
			// Create scrolling for terminal
			var cont = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
			$("#terminal-output").appendTo(cont);
			self.iScrolls.terminal = new IScroll("#terminal-scroll", {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true
			});
			
			// Enforce the right scrollheight and disable main scrolling if we have a scrolling content
			self.iScrolls.terminal.on("beforeScrollStart", function() {
				self.iScrolls.terminal.refresh();
				
				if(this.hasVerticalScroll) {
					self.iScrolls.body.disable();
				}
			});
			self.iScrolls.terminal.on("scrollEnd", function() {
				self.iScrolls.body.enable();
			});

		},
		
		body: function() {
			var self = this;

			// Create main body scroll
			self.iScrolls.body = new IScroll("#scroll", {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true
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
					self.iScrolls.body.off("scrollStart");
					self.iScrolls.body.off("scrollEnd");
					
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

		}
		
	},
	
	modal: {
		modals: [],
		modalDropdown: null,
		init: function() {
			var $document = $(document),
				self = this;
			
			$document.on("show.modalmanager", function(e) {
				var $modalElm = $(e.target);

				if( typeof $modalElm.data("modal") !== "object" ) {
					//assume we are switching tabs
					return;
				}
				
				// Create temp iScroll within the modal
				self.modal.modals.push(new IScroll($modalElm.parent()[0], {
					scrollbars: true,
					mouseWheel: true,
					interactiveScrollbars: true,
					shrinkScrollbars: "scale"
				}));
				
				var curModal = self.modal.modals[self.modal.modals.length-1];
				
				// Ugly, force iScroll to get the correct scrollHeight
				setTimeout(function() {
					curModal.refresh();
				}, 300);
				setTimeout(function() {
					curModal.refresh();
				}, 600);
			
				// Disable all JS events while scrolling for best performance
				var tmp = false;
				curModal.on("scrollStart", function() {
					$modalElm.addClass("no-pointer");
				});
				curModal.on("scrollEnd", function(e) {
					if(tmp !== false) {
						clearTimeout(tmp);
					}
				
					tmp = setTimeout(function() {
						$modalElm.removeClass("no-pointer");
						tmp = false;
					}, 300);
				});
				
				// Disable all JS events while scrolling for best performance
				$modalElm.find('[data-toggle="tab"]').on("click", function(e) {
					e.preventDefault();
					curModal.refresh();
					curModal.scrollTo(0, 0);
					
					setTimeout(function() {
						curModal.refresh();
					}, 300);
					
				});
				
				$modalElm.one("destroy", function() {
					$modalElm.find('[data-toggle="tab"]').off("click");
					curModal.destroy();
					self.modal.modals.pop();
				});
				
			});
				
			// Triggered when we create the dropdown and need scrolling
			$document.on("dropdown-is-open", function(e, elm) {

				// Create dropdown
				self.modal.modalDropdown = new IScroll(elm, {
					scrollbars: true,
					mouseWheel: true,
					interactiveScrollbars: true,
					shrinkScrollbars: "scale"
				});
				
				// Set scroll to active item
				self.modal.modalDropdown.scrollToElement($(elm).find('li.active')[0], 0, 0, -30);
				
				// Disable active modal
				self.modal.modals[self.modal.modals.length-1].disable();
				
				// Disable all JS events for smooth scrolling
				var tmp2 = false;
				self.modal.modalDropdown.on("scrollStart", function(e) {
					$(elm).addClass("no-pointer");
				});
				self.modal.modalDropdown.on("scrollEnd", function(e) {
					if(tmp2 !== false) {
						clearTimeout(tmp2);
					}
				
					tmp2 = setTimeout(function() {
						$(elm).removeClass("no-pointer");
					}, 300);
				});
			});
			
			$document.on("dropdown-is-closed", function() {
				// Enable active modal
				self.modal.modals[self.modal.modals.length-1].enable();
				self.modal.modalDropdown.destroy();
			});
			
		}
	},
};