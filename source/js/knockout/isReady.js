TouchUI.prototype.knockout.isReady = function (viewModels) {
	var self = this;

	if(self.isActive()) {
		// Repaint graph after resize (.e.g orientation changed)
		$(window).on("resize", function() {
			viewModels.temperatureViewModel.updatePlot();
		});

		// Remove slimScroll from files list
		$('.gcode_files').slimScroll({destroy: true});
		$('.slimScrollDiv').slimScroll({destroy: true});

		// Remove active keyboard when disabled
		self.components.keyboard.isActive.subscribe(function(isActive) {
			if( !isActive ) {
				$(".ui-keyboard-input").each(function(ind, elm) {
					$(elm).data("keyboard").destroy();
				});
			}
		});

		// Remove drag files into website feature
		$(document).off("drag");
		$(document).off("dragover");
		if(viewModels.gcodeFilesViewModel && viewModels.gcodeFilesViewModel._enableDragNDrop) {
			viewModels.gcodeFilesViewModel._enableDragNDrop(false);
			viewModels.gcodeFilesViewModel._enableDragNDrop = function() {};
			viewModels.gcodeFilesViewModel._forceEndDragNDrop = function() {};
		}

		// Hide the dropdown after login
		viewModels.settingsViewModel.loginState.loggedIn.subscribe(function(isLoggedIn) {
			if(isLoggedIn && $(".open > .dropdown-menu").length > 0) {
				$(document).trigger("click");
			}
		});

		// Redo scroll-to-end interface
		$("#term .terminal small.pull-right").html('<a href="#"><i class="fa fa-angle-double-down"></i></a>').on("click", function() {
			viewModels.terminalViewModel.scrollToEnd();
			return false;
		});

		// Resize height of low-fi terminal to enable scrolling
		if($("#terminal-output-lowfi").prop("scrollHeight")) {
			viewModels.terminalViewModel.plainLogOutput.subscribe(function() {
				$("#terminal-output-lowfi").height($("#terminal-output-lowfi").prop("scrollHeight"));
			});
		}

		// Overwrite terminal knockout functions (i.e. scroll to end)
		this.scroll.overwrite.call(this, viewModels.terminalViewModel);

		// Setup version tracking in terminal
		this.core.version.init.call(this, viewModels.softwareUpdateViewModel);

		// (Re-)Apply bindings to the new webcam div
		if($("#webcam").length) {
			ko.applyBindings(viewModels.controlViewModel, $("#webcam")[0]);
		}

		// (Re-)Apply bindings to the new navigation div
		if($("#navbar_login").length) {
			try {
				ko.applyBindings(viewModels.navigationViewModel, $("#navbar_login")[0]);
			} catch(err) {}

			viewModels.navigationViewModel.loginState.loggedIn.subscribe(function(loggedIn) {
				if( loggedIn ) {
					if (self.DOM.cookies.get("remember_token", true)) {
						localStorage["remember_token"] = self.DOM.cookies.get("remember_token", true);
					}
					
				} else {
					if (localStorage["remember_token"]) {
						delete localStorage["remember_token"];
					}
				}

				// Refresh scroll view when login state changed
				if( !self.settings.hasTouch ) {
					setTimeout(function() {
						self.scroll.currentActive.refresh();
					}, 0);
				}
			});
		}

		// (Re-)Apply bindings to the new system commands div
		if($("#navbar_systemmenu").length) {
			ko.applyBindings(viewModels.navigationViewModel, $("#navbar_systemmenu")[0]);
			ko.applyBindings(viewModels.navigationViewModel, $("#divider_systemmenu")[0]);
		}

		// Force knockout to read the change
		$('.colorPicker').tinycolorpicker().on("change", function(e, hex, rgb, isTriggered) {
			if(isTriggered !== false) {
				$(this).find("input").trigger("change", [hex, rgb, false]);
			}
		});

		// Reuse for code below
		var refreshUrl = function(href) {
			return href.split("?")[0] + "?ts=" + new Date().getTime();
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
		
		// Evuluate computed subscriber defined above:
		// In OctoPrint >1.3.5 the settings will be defined upfront
		requireNewCSS.notifySubscribers(self.settings.requireNewCSS() && viewModels.loginStateViewModel.isAdmin());
		
		//TODO: move this
		$("li.dropdown#navbar_login > a.dropdown-toggle").off("click").on("click", function(e) {
			e.stopImmediatePropagation();
			e.preventDefault();

			$(this).parent().toggleClass("open");
		});
		
		if (window.top.postMessage) {
			// Tell bootloader we're ready with giving him the expected version for the bootloader
			// if version is lower on the bootloader, then the bootloader will throw an update msg
			window.top.postMessage(self.settings.requiredBootloaderVersion, "*");
			
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
}
