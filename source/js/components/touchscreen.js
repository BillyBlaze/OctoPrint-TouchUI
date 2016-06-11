TouchUI.prototype.components.touchscreen = {

	init: function () {
		$("html").addClass("isTouchscreenUI");
		this.settings.hasTouch = false;
		this.settings.isTouchscreen(true);

		if (this.settings.isEpiphanyOrKweb) {
			this.settings.hasFullscreen(false);
		}

		// Improve performace
		this.scroll.defaults.iScroll.scrollbars = false;
		this.scroll.defaults.iScroll.interactiveScrollbars = false;
		// this.scroll.defaults.iScroll.useTransition = false;
		// this.scroll.defaults.iScroll.useTransform = false;
		// this.scroll.defaults.iScroll.HWCompositing = false;

	},

	isLoading: function (viewModels) {

		if(this.settings.isTouchscreen()) {
			// Disable fancy functionality
			if(viewModels.terminalViewModel.enableFancyFunctionality) { //TODO: check if 1.2.9 to not throw errors in 1.2.8<
				 viewModels.terminalViewModel.enableFancyFunctionality(false);
			}

			// Disable GCodeViewer in touchscreen mode
			if (viewModels.gcodeViewModel) {
				console.info("TouchUI: Disabling GCodeViewer in touchscreen mode...");
				viewModels.gcodeViewModel.enabled = false;
				viewModels.gcodeViewModel.initialize = _.noop;
				viewModels.gcodeViewModel._processData = _.noop;
				$("#gcode_link").remove();
				$("#gcode_link_mirror").remove();
			}

			// Hide old menu icon
			$('#navbar .navbar-inner').hide();

			// Show condensed file list
			$('#files').addClass('condensed');

			// Clone old menu into touchscreen menu
			var container = $("#all_touchui_settings > .dropdown-menu").removeAttr("class").attr("id", "touchui-overlay-animation");
			var menu = container.children('ul').attr("id", "touchui-overlay-menu");
			container.appendTo('.octoprint-container');

			// Loop through cloned items
			menu.children().each(function(ind, elm) {
				var $elm = $(elm);

				if($elm.hasClass('divider')) {
					return;
				}

				// Attach click handler and click on the original link if found
				$elm.children('a').on("click", function(e) {
					e.preventDefault();
					container.removeClass('active');
					$("#" + ($(e.delegateTarget).attr("id") || "").replace("_clone", "_mirror")).find('a').click();
				});

			});

			// Open touchscreen menu when clicking headings
			$(".accordion-heading > a").removeAttr("data-toggle").off("click");
			$(document).on("click", ".accordion-heading > a", function(e) {
				e.preventDefault();
				container.addClass('active');
			});

			// Remove waves-effect
			$('#touchui-overlay-menu .waves-effect').removeClass('waves-effect');

			// Allow login
			$('#navbar_login > .dropdown-toggle').on("click", function(e) {
				$('#touchui-overlay-menu').toggleClass('open');

				if($('#login_dropdown_loggedout + .fab-back').length === 0) {
					setTimeout(function() {
						$('<div class="fab-back"></div>').insertAfter('#login_dropdown_loggedout').on("click", function(e) {
							$('#touchui-overlay-menu').removeClass('open');
						});
					});
				}
			});

			if (!this.settings.hasTouch) {
				this.scroll.touchscreen.init.call(this);
			}

		}

	}

}
