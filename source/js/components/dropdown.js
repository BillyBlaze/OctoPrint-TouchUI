TouchUI.prototype.components.dropdown = {

	init: function() {
		this.components.dropdown.toggleSubmenu.call( this );
		this.components.dropdown.toggle.call( this );
	},

	// Rewrite opening of dropdowns
	toggle: function() {
		var self = this,
			namespace = ".touchui.dropdown-toggle";

		$(document)
			.off('.dropdown')
			.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
			.on('click.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
				var $dropdownToggle = $(e.target),
					$dropdownContainer = $dropdownToggle.parent();

				// Stop the hashtag from propagating
				e.preventDefault();

				// Toggle the targeted dropdown
				$dropdownContainer.toggleClass("open");

				// Skip everything if we are in a dropdown toggling a dropdown (one click event is enuff!)
				if( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) {
					return;
				}

				// Remove all other active dropdowns
				$('.open [data-toggle="dropdown"]').not($dropdownToggle).parent().removeClass('open');

				// Refresh current scroll and add a min-height so we can reach the dropdown if needed
				if ( !self.isTouch ) {
					setTimeout(function() {
						var y = Math.abs(self.scroll.currentActive.y),
							height = $dropdownToggle.next().outerHeight(),
							top = $dropdownToggle.next().offset().top;

						$('.octoprint-container').css("min-height", y + top + height);
						self.scroll.currentActive.refresh();
					}, 0);
				}

				$(document).off("click"+namespace).on("click"+namespace, function(event) {
					// Check if we scrolled (touch devices wont trigger this click event after scrolling so assume we didn't move)
					var moved = ( !self.isTouch ) ? self.scroll.currentActive.moved : false,
						$target = $(event.target);

					if (
						!moved && //If scrolling did not move
						(
							!$target.parents().is($dropdownContainer) || //Ignore made clicks within the dropdown container
							$target.is('a:not([data-toggle])') //Unless it's a link but not a [data-toggle]
						)
					) {
						$(document).off(event);
						$dropdownContainer.removeClass('open');

						if ( !self.isTouch ) {
							$('.octoprint-container').css("min-height", 0);
							self.scroll.currentActive.refresh();
						}
					}
				});
			});

	},

	// Support 1.3.0 onMouseOver dropdowns
	toggleSubmenu: function() {
		$(".dropdown-submenu").addClass("dropdown");
		$(".dropdown-submenu > a").attr("data-toggle", "dropdown");
	}

}
