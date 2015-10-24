!function ($) {

	$.fn.TouchUI.knockout = {

		beforeLoad: function(viewModels) {
			var self = this,
				terminalViewModel = viewModels[0],
				connectionViewModel = viewModels[1],
				settingsViewModel = viewModels[2],
				softwareUpdateViewModel = viewModels[3],
				controlViewModel = viewModels[4],
				gcodeFilesViewModel = viewModels[5];

			this.DOM.init.call(this);
			this.scroll.beforeLoad.call(this);

			gcodeFilesViewModel.listHelper.paginatedItems.subscribe(function(a) {
				if( !self.isTouch ) {
					setTimeout(function() {
						self.scroll.iScrolls.body.refresh();
					}, 600);
				}
			});
		},

		isReady: function(touchViewModel, viewModels) {
			var self = this,
				terminalViewModel = viewModels[0],
				connectionViewModel = viewModels[1],
				settingsViewModel = viewModels[2],
				softwareUpdateViewModel = viewModels[3],
				controlViewModel = viewModels[4],
				gcodeFilesViewModel = viewModels[5],
				navigationViewModel = viewModels[7];

			this.terminal.init.call(this, terminalViewModel);

			// Remove slimScroll from files list
			$('.gcode_files').slimScroll({destroy: true});
			$('.slimScrollDiv').slimScroll({destroy: true});

			// Remove drag files into website feature
			$(document).off("dragover");

			// Watch the operational binder for visual online/offline
			var subscription = connectionViewModel.isOperational.subscribe(function(newOperationalState) {
				var printLink = $("#all_touchui_settings");
				if( !newOperationalState ) {
					printLink.addClass("offline").removeClass("online");
					$("#conn_link2").addClass("offline").removeClass("online");
				} else {
					printLink.removeClass("offline").addClass("online");
					$("#conn_link2").removeClass("offline").addClass("online");
				}
			});

			// Redo scroll-to-end interface
			$("#term .terminal small.pull-right").html('<a href="#"><i class="fa fa-angle-double-down"></i></a>').on("click", function() {
				terminalViewModel.scrollToEnd();
				return false;
			});

			// Overwrite terminal knockout functions (i.e. scroll to end)
			this.scroll.koOverwrite.call(this, terminalViewModel);

			// Setup version tracking in terminal
			this.version.init.call(this, softwareUpdateViewModel);

			// Bind fullscreenChange to knockout
			$(document).bind("fullscreenchange", function() {
				self.isFullscreen = ($(document).fullScreen() !== false);
				touchViewModel.isFullscreen(self.isFullscreen);
				self.DOM.cookies.set("fullscreen", self.isFullscreen);
			});

			// Hide topbar and/or refresh the scrollheight if clicking an item
			// Notice: Use delegation in order to trigger the event after the tab content has changed, other click events fire before content change.
			$(document).on("click", '#tabs [data-toggle="tab"]', function() {
				self.animate.hide.call(self, "navbar");
			});

			// (Re-)Apply bindings to the new webcam div
			if($("#webcam").length > 0) {
				ko.applyBindings(controlViewModel, $("#webcam")[0])
			}
			// (Re-)Apply bindings to the new div's
			if($("#rate-panel").length > 0) {
				ko.applyBindings(controlViewModel, $("#rate-panel")[0])
			}
			// (Re-)Apply bindings to the new div's
			if($("#navbar_login").length > 0) {
				ko.applyBindings(navigationViewModel, $("#navbar_login")[0]);

				// Force the dropdown to appear open when logedIn
				navigationViewModel.loginState.loggedIn.subscribe(function(loggedIn) {
					if( loggedIn ) {
						$('#navbar_login a.dropdown-toggle').addClass("hidden_touch");
						$('#login_dropdown_loggedin').removeClass('hide dropdown open').addClass('visible_touch');
					} else {
						$('#navbar_login a.dropdown-toggle').removeClass("hidden_touch");
						$('#login_dropdown_loggedin').removeClass('visible_touch');
					}
				});
			}

if($("#navbar_systemmenu").length > 0) {
	ko.applyBindings(navigationViewModel, $("#navbar_systemmenu")[0]);
}

		}
	}

}(window.jQuery);
