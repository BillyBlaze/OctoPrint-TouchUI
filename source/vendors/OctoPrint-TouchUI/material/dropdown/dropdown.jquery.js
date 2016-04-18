$(function() {
	var namespace = ".touchui.dropdown";

	$(document)
		.off('.dropdown')
		.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
		.on('click.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
			var $dropdownToggle = $(e.currentTarget);
			var $dropdownContainer = $dropdownToggle.parent();
			var $dropdownMenu = $dropdownContainer.children('.dropdown-menu');

			// Stop the hashtag from propagating
			e.preventDefault();

			// Toggle the targeted dropdown
			$dropdownContainer.toggleClass("open");

			// Refresh current scroll and add a min-height so we can reach the dropdown if needed
			// self.components.dropdown.containerMinHeight.call(self, $dropdownContainer, $dropdownToggle);

			// Skip everything if we are in a dropdown toggling a dropdown (one click event is enuff!)
			if( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) {
				return;
			}

			if( $dropdownContainer.is('#all_touchui_settings') ) {
				$('#navbar').toggleClass("open");
			}

			// Remove all other active dropdowns
			$('.open [data-toggle="dropdown"]').not($dropdownToggle).parent().removeClass('open');

			// Notify main TouchUI scope
			$(document).trigger("dropdown-open.touchui", [$dropdownMenu, $dropdownToggle]);

			// Check if we scrolled (touch devices wont trigger this click event after scrolling so assume we didn't move)
			$(document).off("click"+namespace).on("click"+namespace, function(eve) {
				var moved = ( !TouchUI.prototype.settings.hasTouch ) ? TouchUI.prototype.scroll.currentActive.moved : false,
					$target = $(eve.target);

				if (
					!moved && // If scrolling did not move
					!$target.parents(".ui-pnotify").length && // if not a click within notifiaction
					(
						!$target.parents().is($dropdownContainer) || // if clicks are not made within the dropdown container
						$target.is('a:not([data-toggle="dropdown"])') || // Unless it's a link but not a [data-toggle]
						$target.parent().is('a:not([data-toggle="dropdown"])')
					)
				) {
					$(document).off(eve);
					$dropdownContainer.removeClass('open');
					$dropdownMenu.removeAttr('style');

					if( $dropdownContainer.is('#all_touchui_settings') ) {
						$('#navbar').removeClass("open");
					}

					$(document).trigger("dropdown-closed.touchui");
				}
			});
		});

});
