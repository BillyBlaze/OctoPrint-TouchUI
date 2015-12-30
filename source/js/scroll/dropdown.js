TouchUI.prototype.scroll.dropdown = {

	init: function() {

		var self = this,
			namespace = ".dropdown-toggle.touchui",
			$noPointer = $('.page-container');

		$(document)
			.on("mouseup.prevent.pointer touchend.prevent.pointer", function() {
				$noPointer.removeClass('no-pointer');
			});

		// Improve scrolling while dropdown is open
		$(document)
			.off('.dropdown')
			.on('click.dropdown touchstart.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
			.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
			.on('click.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
				var $dropdownToggle = $(e.target),
					dropdownToggle = e.target,
					hasScroll = false,
					scrollTimeout = false,
					scrollEnd, scrollStart, removeEvent;

				e.preventDefault();
				e.stopPropagation();

				// Toggle dropdown
				$dropdownToggle.parent().toggleClass('open');

				// Refresh current scroll
				if ( !self.isTouch ) {
					setTimeout(function() {
						try {
							var translateY = parseFloat($('.page-container').css("transform").split(",")[5].replace("-",""));
							$('.octoprint-container').css("min-height", $dropdownToggle.next().outerHeight() + $dropdownToggle.next().offset().top + translateY);
							self.scroll.currentActive.refresh();
						} catch(err) {
							// wee
						}
					}, 0);
				}

				// Skip everything if we are in the main dropdown toggle dropdowns
				if( $dropdownToggle.parents('#all_touchui_settings .dropdown-menu').length > 0 ) {
					return;
				}

				// Remove all other active dropdowns
				$('.open [data-toggle="dropdown"]').not($dropdownToggle).parent().removeClass('open');

				// Stop creating to many events
				if ( $dropdownToggle.parent().hasClass('hasEvents') ) {
					return;
				}

				// Prevent the many events
				$dropdownToggle.parent().addClass("hasEvents");

				// Block everthing while scrolling
				if ( !self.isTouch ) {
					scrollStart = function() {
						hasScroll = true;
						$noPointer.addClass("no-pointer");
					};
					scrollEnd = function() {
						if(scrollTimeout !== false) {
							clearTimeout(scrollTimeout);
						}
						scrollTimeout = setTimeout(function() { hasScroll = false; scrollTimeout = false; }, 100);
					};

					self.scroll.currentActive.on("scrollStart", scrollStart);
					self.scroll.currentActive.on("scrollCancel", scrollEnd);
					self.scroll.currentActive.on("scrollEnd", scrollEnd);
				}

				$(document).on("click"+namespace, function(event) {

					if( !hasScroll || self.isTouch ) {
						var $elm = $(event.target);

						$(document).off(namespace);

						if ( !self.isTouch ) {
							self.scroll.currentActive.off("scrollStart", scrollStart);
							self.scroll.currentActive.off("scrollCancel", scrollEnd);
							self.scroll.currentActive.off("scrollEnd", scrollEnd);
							$('.octoprint-container').css("min-height", 0);
							self.scroll.currentActive.refresh();
						}

						$dropdownToggle.parent().removeClass("hasEvents");
						$(e.target).parent().removeClass('open');

						event.preventDefault();
						event.stopPropagation();
						return false;

					} else {

						hasScroll = false;

					}

				});

			});

	}


}
