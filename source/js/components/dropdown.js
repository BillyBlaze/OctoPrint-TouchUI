TouchUI.prototype.components.dropdown = {

	init: function() {
		this.components.dropdown.toggleSubmenu.call( this );
		this.components.dropdown.toggle.call( this );
	},

	// Rewrite opening of dropdowns
	toggle: function() {
		var self = this;
		var $document = $(document);

		// Triggered when we create the dropdown and need scrolling
		$document.on("dropdown-open.touchui", function(e, elm, $toggle) {
			var $elm = $(elm);
			var div;

			// Animate height with CSS transition
			var $height = $elm.innerHeight();
			$(div).height($height - ($height * 0.7));
			$(div).height($height);

			if (!self.settings.hasTouch) {

				if (!$toggle.data("iscroll")) {

					div = $('<div/>').addClass("dropdown-menu").insertAfter(elm)[0];
					$elm.appendTo(div).removeClass("dropdown-menu");

					// Create dropdown scroll
					self.scroll.modal.dropdown = new IScroll(div, $.extend({ fadeScrollbars: false }, self.scroll.defaults.iScroll));

					// Store bindings into variable for future reference
					var scrollStart = self.scroll.blockEvents.scrollStart.bind(self, $elm, self.scroll.modal.dropdown),
						scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self, $elm, self.scroll.modal.dropdown);

					// Disable all JS events for smooth scrolling
					self.scroll.modal.dropdown.on("scrollStart", scrollStart);
					self.scroll.modal.dropdown.on("scrollEnd", scrollEnd);
					self.scroll.modal.dropdown.on("scrollCancel", scrollEnd);

					$toggle.data("iscroll", self.scroll.modal.dropdown);

				} else {

					div = elm;
					self.scroll.modal.dropdown = $toggle.data("iscroll");

				}

				setTimeout(function() {
					if (self.scroll.modal.dropdown) {
						self.scroll.refresh(self.scroll.modal.dropdown);
					}
				}, 0);
				setTimeout(function() {
					if (self.scroll.modal.dropdown) {
						self.scroll.refresh(self.scroll.modal.dropdown);
					}
				}, 180);

				// Set scroll to active item
				//self.scroll.modal.dropdown.scrollToElement($elm.find('li.active')[0], 0, 0, -30);

				// Disable scrolling in active modal
				if (!$(div).parents('#all_touchui_settings').length) {
					self.scroll.currentActive.disable();
					self.scroll.iScrolls.terminal.disable();
				}

				$document.on("dropdown-closed.touchui", function(eve) {
					self.scroll.refresh(self.scroll.currentActive);
					self.scroll.iScrolls.terminal.enable();

					if (!$toggle.parents("#all_touchui_settings").length) {
						// Enable active modal
						self.scroll.currentActive.enable();
						$document.off(eve);

						if (self.scroll.modal.dropdown) {
							self.scroll.modal.dropdown = null;
						}
					}

				});
			}
		});
	},

	// Support 1.3.0 onMouseOver dropdowns
	toggleSubmenu: function() {
		$(".dropdown-submenu").addClass("dropdown");
		$(".dropdown-submenu > a").attr("data-toggle", "dropdown");
	},

	// Refresh current scroll and add a min-height so we can reach the dropdown if needed
	// containerMinHeight: function($dropdownContainer, $dropdownToggle) {
	// 	var self = this;
	//
	// 	// Touch devices can reach the dropdown by CSS, only if we're using iScroll
	// 	if ( !self.settings.hasTouch ) {
	// 		// Get active container
	// 		var $container = ($dropdownContainer.parents('.modal').length === 0 ) ? $('.octoprint-container') : $dropdownContainer.parents('.modal .modal-body');
	//
	// 		// If we toggle within the dropdown then get the parent dropdown for total height
	// 		var $dropdownMenu = ( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) ? $dropdownContainer.parents('.open > .dropdown-menu') : $dropdownToggle.next();
	//
	// 		setTimeout(function() {
	//
	// 			//If the main dropdown has closed (by toggle) then let's remove the min-height else
	// 			if(!$dropdownMenu.parent().hasClass("open")) {
	// 				$container.css("min-height", 0);
	// 				self.scroll.currentActive.refresh();
	// 			} else {
	// 				var y = Math.abs(self.scroll.currentActive.y),
	// 					height = $dropdownMenu.outerHeight(),
	// 					top = $dropdownMenu.offset().top;
	//
	// 				$container.css("min-height", y + top + height);
	// 				self.scroll.currentActive.refresh();
	// 			}
	//
	// 		}, 0);
	// 	}
	// }

}
