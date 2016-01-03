TouchUI.prototype.knockout.isReady = function(touchViewModel, viewModels) {
	var self = this;

	// Repaint graph after resize (.e.g orientation changed)
	$(window).on("resize", function() {
		viewModels.temperatureViewModel.updatePlot();
	});

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

	// Hide the dropdown after login
	// var subscription = viewModels.settingsViewModel.loginState.loggedIn.subscribe(function(isLoggedIn) {
	// 	if(isLoggedIn && $(".open > .dropdown-menu").length > 0) {
	// 		$(document).trigger("click");
	// 		console.log("triggered click");
	// 	}
	// });

	// Watch the operational binder for visual online/offline
	var subscription = viewModels.connectionViewModel.isOperational.subscribe(function(newOperationalState) {
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
		viewModels.terminalViewModel.scrollToEnd();
		return false;
	});

	// Overwrite terminal knockout functions (i.e. scroll to end)
	this.scroll.overwrite.call(this, viewModels.terminalViewModel);

	// Setup version tracking in terminal
	this.core.version.init.call(this, viewModels.softwareUpdateViewModel);

	// (Re-)Apply bindings to the new webcam div
	if($("#webcam").length > 0) {
		ko.applyBindings(viewModels.controlViewModel, $("#webcam")[0]);
	}

	// (Re-)Apply bindings to the new controls div
	if($("#control-jog-feedrate").length > 0) {
		ko.cleanNode($("#control-jog-feedrate")[0]);
		ko.applyBindings(viewModels.controlViewModel, $("#control-jog-feedrate")[0]);
	}

	// (Re-)Apply bindings to the new navigation div
	if($("#navbar_login").length > 0) {
		ko.applyBindings(viewModels.navigationViewModel, $("#navbar_login")[0]);

		// Force the dropdown to appear open when logedIn
		viewModels.navigationViewModel.loginState.loggedIn.subscribe(function(loggedIn) {
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
		ko.applyBindings(viewModels.navigationViewModel, $("#navbar_systemmenu")[0]);
		ko.applyBindings(viewModels.navigationViewModel, $("#divider_systemmenu")[0]);
	}

	// Force knockout to read the change
	$('.colorPicker').tinycolorpicker().on("change", function(e, hex, rgb, isTriggered) {
		if(isTriggered !== false) {
			$(this).find("input").trigger("change", [hex, rgb, false]);
		}
	});

	if( !self.isTouch ) {
		viewModels.gcodeFilesViewModel.listHelper.paginatedItems.subscribe(function(a) {
			setTimeout(function() {
				try {
					self.scroll.iScrolls.body.refresh();
				} catch(err) {
					// Do nothing
				};
			}, 300);
		});
	}

	// Check if we can show whats new in this version
	touchViewModel.settings.whatsNew.subscribe(function(whatsNew) {
		if(whatsNew !== false && whatsNew.trim() != "") {
			new PNotify({
				title: 'TouchUI: What\'s new?',
				text: whatsNew,
				icon: 'glyphicon glyphicon-question-sign',
				type: 'info',
				hide: false
			});
		}
	});

	// Display any backend errors
	touchViewModel.settings.error.subscribe(function(hasError) {
		if(hasError !== false && hasError.trim() != "") {

			// If Settings Modal is open, then block the hide of the modal once
			if(viewModels.settingsViewModel.settingsDialog.is(":visible")) {
				var tmp = viewModels.settingsViewModel.settingsDialog.modal;
				viewModels.settingsViewModel.settingsDialog.modal = function() {
					viewModels.settingsViewModel.settingsDialog.modal = tmp;
				};
			}

			new PNotify({
				title: 'TouchUI: Whoops, something went wrong...',
				text: hasError,
				icon: 'glyphicon glyphicon-question-sign',
				type: 'error',
				hide: false
			});
		}
	});

	// Reload CSS or LESS after saving our settings
	var afterSettingsSave = ko.computed(function() {
		return !viewModels.settingsViewModel.receiving() && !viewModels.settingsViewModel.sending() && touchViewModel.settingsUpdated();
	});
	afterSettingsSave.subscribe(function(settingsSaved) {
		if(settingsSaved && !touchViewModel.settings.error()) {
			var $less = $("#touchui-custom-less"),
				$css = $("#touchui-css-only");

			touchViewModel.settingsUpdated(false);
			if(touchViewModel.settings.hasLESS()) {

				if($less.length === 0) {
					$('<link href="' + $("#data-touchui").attr("data-less") + '" rel="stylesheet/less" type="text/css" media="screen" id="touchui-custom-less">').appendTo("body");
					less.sheets[0] = document.getElementById('touchui-custom-less');
				}

				$less.attr("href", $("#data-touchui").attr("data-less") + "?v=" + new Date().getTime());
				$('style:not(#touch_updates_css)').remove();
				$css.remove();
				less.refresh();

			} else {

				if($css.length === 0) {
					$('<link rel="stylesheet" type="text/css" media="screen" id="touchui-css-only">').appendTo("head").attr("href", $("#data-touchui").attr("data-css"));
				}

				$('style:not(#touch_updates_css)').remove();
				$less.remove();

			}
		}
	});

}
