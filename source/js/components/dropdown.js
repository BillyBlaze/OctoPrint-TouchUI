TouchUI.prototype.components.dropdown = {

	init: function() {
		this.components.dropdown.toggleSubmenu.call( this );
		this.components.dropdown.toggle.call( this );
	},

	// Rewrite opening of dropdowns
	toggle: function() {
		var self = this;
		var namespace = ".touchui.dropdown";

		$(document)
			.off('.dropdown')
			.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
			.on('click.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
				var $dropdownToggle = $(e.currentTarget);
				var $dropdownContainer = $dropdownToggle.parent();

				// Stop the hashtag from propagating
				e.preventDefault();

				// Toggle the targeted dropdown
				$dropdownContainer.toggleClass("open");

				// Refresh current scroll and add a min-height so we can reach the dropdown if needed
				self.components.dropdown.containerMinHeight.call(self, $dropdownContainer, $dropdownToggle);

				// Skip everything if we are in a dropdown toggling a dropdown (one click event is enuff!)
				if( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) {
					return;
				}

				// Remove all other active dropdowns
				$('.open [data-toggle="dropdown"]').not($dropdownToggle).parent().removeClass('open');

				if ( !self.settings.hasTouch ) {
					self.scroll.iScrolls.terminal.disable();
				}

				$(document).off("click"+namespace).on("click"+namespace, function(eve) {
					// Check if we scrolled (touch devices wont trigger this click event after scrolling so assume we didn't move)
					var moved = ( !self.settings.hasTouch ) ? self.scroll.currentActive.moved : false,
						$target = $(eve.target);

					if (
						!moved && // If scrolling did not move
						$target.parents(".ui-pnotify").length === 0 && // if not a click within notifiaction
						(
							!$target.parents().is($dropdownContainer) || // if clicks are not made within the dropdown container
							$target.is('a:not([data-toggle="dropdown"])') // Unless it's a link but not a [data-toggle]
						)
					) {
						$(document).off(eve);
						$dropdownContainer.removeClass('open');

						if ( !self.settings.hasTouch ) {
							$('.octoprint-container').css("min-height", 0);
							self.scroll.currentActive.refresh();
							self.scroll.iScrolls.terminal.enable();
						}
					}
				});
			});

	},

	// Support 1.3.0 onMouseOver dropdowns
	toggleSubmenu: function() {
		$(".dropdown-submenu").addClass("dropdown");
		$(".dropdown-submenu > a").attr("data-toggle", "dropdown");
	},

	// Refresh current scroll and add a min-height so we can reach the dropdown if needed
	containerMinHeight: function($dropdownContainer, $dropdownToggle) {
		var self = this;

		// Touch devices can reach the dropdown by CSS, only if we're using iScroll
		if ( !self.settings.hasTouch ) {
			// Get active container
			var $container = ($dropdownContainer.parents('.modal').length === 0 ) ? $('.octoprint-container') : $dropdownContainer.parents('.modal .modal-body');

			// If we toggle within the dropdown then get the parent dropdown for total height
			var $dropdownMenu = ( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) ? $dropdownContainer.parents('.open > .dropdown-menu') : $dropdownToggle.next();

			setTimeout(function() {

				//If the main dropdown has closed (by toggle) then let's remove the min-height else
				if(!$dropdownMenu.parent().hasClass("open")) {
					$container.css("min-height", 0);
					self.scroll.currentActive.refresh();
				} else {
					var y = Math.abs(self.scroll.currentActive.y),
						height = $dropdownMenu.outerHeight(),
						top = $dropdownMenu.offset().top;

					$container.css("min-height", y + top + height);
					self.scroll.currentActive.refresh();
				}

			}, 0);
		}
	}

}
