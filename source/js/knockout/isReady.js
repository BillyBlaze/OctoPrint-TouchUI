TouchUI.prototype.knockout.isReady = function (viewModels) {
	var self = this;

	if (self.isActive()) {

		// Setup theming in Android 5
		self.settings.colors.mainColor.subscribe(function(value) {
			var theme;
			if($('[name="theme-color"]').length) {
				theme = $('[name="theme-color"]');
			} else {
				theme = $('<meta name="theme-color">').appendTo('head');
			}
			theme.attr("content", value);
		});
		self.settings.colors.mainColor.valueHasMutated();

		if (viewModels.temperatureViewModel) {
			if (self.settings.isTouchscreen()) {
				$.plot = _.noop;
			} else {
				$('#dashboard').addClass('withGraph');
				viewModels.temperatureViewModel.plotOptions = $.extend(viewModels.temperatureViewModel.plotOptions, {
					xaxis: {
						ticks: false,
						mode: "time",
						maxTickSize: [2, "minute"]
					},
					yaxis: {
						max: 310,
						min: 0,
						ticks: false
					},
					series: {
						lines: {
							show: true,
							lineWidth: 0,
							fill: true
						},
						grid: {
							hoverable: true,
							clickable: true,
							borderWidth: 0,
							margin: 0
						}
					},
					grid: {
						borderWidth: 0,
						margin: 0
					}
				});
			}

		}

		// Repaint graph after resize (.e.g orientation changed)
		$(window).on("resize", function() {
			viewModels.temperatureViewModel.updatePlot();
		});

		// Remove slimScroll from files list
		$('.gcode_files').slimScroll({destroy: true});
		$('.slimScrollDiv').slimScroll({destroy: true});

		// Remove active keyboard when disabled
		self.settings.isKeyboardActive.subscribe(function(isActive) {
			if( !isActive ) {
				$(".ui-keyboard-input").each(function(ind, elm) {
					$(elm).data("keyboard").destroy();
				});
			}
		});

		// Remove drag files into website feature
		$(document).off("dragover");
		if (viewModels.gcodeFilesViewModel._enableDragNDrop) {
			viewModels.gcodeFilesViewModel._enableDragNDrop = function() {};
		}

		// Hide the dropdown after login
		viewModels.settingsViewModel.loginState.loggedIn.subscribe(function(isLoggedIn) {
			if(isLoggedIn && $(".open > .dropdown-menu").length > 0) {
				$(document).trigger("click");
			}
		});

		// Overwrite terminal knockout functions (i.e. scroll to end)
		this.scroll.overwrite.call(this, viewModels.terminalViewModel);

		// Setup version tracking in terminal
		this.core.version.init.call(this, viewModels.softwareUpdateViewModel);

		// (Re-)Apply vindings to new dashboard
		if ($("#state_wrapper").length) {
			if (viewModels.navigationViewModel) {
				ko.applyBindings(viewModels.navigationViewModel, $("#dashboard .accordion-heading .accordion-toggle")[0]);
			}
			if (viewModels.printerStateViewModel) {
				ko.applyBindings(viewModels.printerStateViewModel, $("#dashboard .accordion-heading .print-control")[0]);
			}
		}

		// (Re-)Apply bindings to the new webcam div
		if ($("#webcam").length) {
			ko.applyBindings(viewModels.controlViewModel, $("#webcam")[0]);
		}

		// (Re-)Apply bindings to the new navigation div
		if ($("#navbar_login").length) {
			try {
				ko.applyBindings(viewModels.navigationViewModel, $("#navbar_login")[0]);
			} catch(err) {}

			// Force the dropdown to appear open when logedIn
			viewModels.navigationViewModel.loginState.loggedIn.subscribe(function(loggedIn) {
				if( loggedIn ) {
					$('#navbar_login a.dropdown-toggle').addClass("hidden_touch");
					$('#login_dropdown_loggedin').removeClass('hide dropdown open').addClass('visible_touch');
					
					if (self.DOM.cookies.get("remember_token", true)) {
						localStorage["remember_token"] = self.DOM.cookies.get("remember_token", true);
					}
					
				} else {
					$('#navbar_login a.dropdown-toggle').removeClass("hidden_touch");
					$('#login_dropdown_loggedin').removeClass('visible_touch');
					
					if (localStorage["remember_token"]) {
						delete localStorage["remember_token"];
					}
				}
			});
		}

		// (Re-)Apply bindings to the new system commands div
		// if ($("#navbar_systemmenu").length) {
		// 	// ko.applyBindings(viewModels.navigationViewModel, $("#navbar_systemmenu")[0]);
		// 	ko.applyBindings(viewModels.navigationViewModel, $("#files_link_mirror")[0]);
		// 	ko.applyBindings(viewModels.navigationViewModel, $("#temp_link_mirror")[0]);
		// }

		// Force knockout to read the change
		// $('.colorPicker').tinycolorpicker().on("change", function(e, hex, rgb, isTriggered) {
		// 	if(isTriggered !== false) {
		// 		$(this).find("input").trigger("change", [hex, rgb, false]);
		// 	}
		// });

		// Reuse for code below
		var refreshUrl = function(href) {
			return href.split("?")[0] + "?ts=" + new Date().getMilliseconds();
		}

		// Reload CSS if needed
		self.settings.refreshCSS.subscribe(function(hasRefresh) {
			if (hasRefresh || hasRefresh === "fast") {
				// Wait 2 seconds, so we're not too early
				setTimeout(function() {
					var $css = $("#touchui-css");
					$css.attr("href", refreshUrl($css.attr("href")));
					self.settings.refreshCSS(false);
				}, (hasRefresh === "fast") ? 0 : 1200);
			}
		});

		// Reload CSS or LESS after saving our settings
		self.settings.hasCustom.subscribe(function(customCSS) {
			if(customCSS !== "") {
				var $css = $("#touchui-css");
				var href = $css.attr("href");

				if(customCSS) {
					href = href.replace("touchui.css", "touchui.custom.css");
				} else {
					href = href.replace("touchui.custom.css", "touchui.css");
				}

				$css.attr("href", refreshUrl(href));
			}
		});
	}

	// Check if we need to update an old LESS file with a new LESS one
	var requireNewCSS = ko.computed(function() {
		return self.settings.requireNewCSS() && viewModels.loginStateViewModel.isAdmin();
	});
	requireNewCSS.subscribe(function(requireNewCSS) {
		if(requireNewCSS) {
			setTimeout(function() {
				self.core.less.save.call(self, self);
			}, 100);
		}
	});
	
	if (window.top.postMessage) {
		// Tell bootloader we're ready with giving him the expected version for the bootloader
		// if version is lower on the bootloader, then the bootloader will throw an update msg
		window.top.postMessage(1, "*");
		
		// Sync customization with bootloader
		window.top.postMessage([true, $("#navbar").css("background-color"), $("body").css("background-color")], "*");
		
		// Stop watching for errors
		$(window).off("error.touchui");
		
		// Trigger wake-up for iScroll
		if(window.dispatchEvent) {
			window.dispatchEvent(new Event('resize'));
		}
	}

}
