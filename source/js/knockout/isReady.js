TouchUI.prototype.knockout.isReady = function(touchViewModel, viewModels) {
	var self = this,
		terminalViewModel = viewModels[0],
		connectionViewModel = viewModels[1],
		settingsViewModel = viewModels[2],
		softwareUpdateViewModel = viewModels[3],
		controlViewModel = viewModels[4],
		gcodeFilesViewModel = viewModels[5],
		navigationViewModel = viewModels[6];

	// Remove slimScroll from files list
	$('.gcode_files').slimScroll({destroy: true});
	$('.slimScrollDiv').slimScroll({destroy: true});

	// Remove active keyboard when disabled
	touchViewModel.isKeyboardActive.subscribe(function(isActive) {
		if( !isActive ) {
			$(".ui-keyboard-input").each(function(ind, elm) {
				$(elm).data("keyboard").destroy();
			});
		}
	});

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
	this.scroll.overwrite.call(this, terminalViewModel);

	// Setup version tracking in terminal
	this.core.version.init.call(this, softwareUpdateViewModel);

	// Bind fullscreenChange to knockout
	$(document).bind("fullscreenchange", function() {
		self.isFullscreen = ($(document).fullScreen() !== false);
		touchViewModel.isFullscreen(self.isFullscreen);
		self.DOM.cookies.set("fullscreen", self.isFullscreen);
	});

	// (Re-)Apply bindings to the new webcam div
	if($("#webcam").length > 0) {
		ko.applyBindings(controlViewModel, $("#webcam")[0]);
	}
	if($("#control-jog-feedrate").length > 0) {
		ko.cleanNode($("#control-jog-feedrate")[0]);
		ko.applyBindings(controlViewModel, $("#control-jog-feedrate")[0]);
	}
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

			// Refresh scroll view when login state changed
			if( !self.isTouch ) {
				setTimeout(function() {
					self.scroll.currentActive.refresh();
				}, 0);
			}
		});
	}

	if($("#navbar_systemmenu").length > 0) {
		ko.applyBindings(navigationViewModel, $("#navbar_systemmenu")[0]);
		ko.applyBindings(navigationViewModel, $("#divider_systemmenu")[0]);
	}

	// Hide topbar and/or refresh the scrollheight if clicking an item
	// Notice: Use delegation in order to trigger the event after the tab content has changed, other click events fire before content change.
	$(document).on("click", '#tabs [data-toggle="tab"]', function() {
		self.animate.hide.call(self, "navbar");
	});

	$('.colorPicker').tinycolorpicker().on("change", function(e, hex, rgb, isTriggered) {
		if(isTriggered !== false) {
			$(this).find("input").trigger("change", [hex, rgb, false]);
		}
	});

}
