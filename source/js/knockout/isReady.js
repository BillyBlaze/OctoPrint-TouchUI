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

	// (Re-)Apply bindings to the new controls div
	if($("#control-jog-feedrate").length > 0) {
		ko.cleanNode($("#control-jog-feedrate")[0]);
		ko.applyBindings(controlViewModel, $("#control-jog-feedrate")[0]);
	}

	// (Re-)Apply bindings to the new navigation div
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

	// (Re-)Apply bindings to the new system commands div
	if($("#navbar_systemmenu").length > 0) {
		ko.applyBindings(navigationViewModel, $("#navbar_systemmenu")[0]);
		ko.applyBindings(navigationViewModel, $("#divider_systemmenu")[0]);
	}

	// Force knockout to read the change
	$('.colorPicker').tinycolorpicker().on("change", function(e, hex, rgb, isTriggered) {
		if(isTriggered !== false) {
			$(this).find("input").trigger("change", [hex, rgb, false]);
		}
	});

	// Force the webcam tab to load the webcam feed that original is located on the controls tab
	$('#tabs a[data-toggle="tab"]').each(function(ind, elm) {

		// Get the currently attached events to the toggle
		var events = $.extend([], jQuery._data(elm, "events").show),
			$elm = $(elm);

		// Remove all previous set events and call them after manipulating a few things
		$elm.off("show").on("show", function(e) {
			var scope = this,
				current = e.target.hash,
				previous = e.relatedTarget.hash;

			current = (current === "#control") ? "#control_without_webcam" : current;
			current = (current === "#webcam") ? "#control" : current;

			previous = (previous === "#control") ? "#control_without_webcam" : previous;
			previous = (previous === "#webcam") ? "#control" : previous;

			// Call previous unset functions (e.g. let's trigger the event onTabChange in all the viewModels)
			$.each(events, function(key, event) {
				event.handler.call(scope, {
					target: {
						hash: current
					},
					relatedTarget: {
						hash: previous
					}
				});
			});
		})
	});

}
