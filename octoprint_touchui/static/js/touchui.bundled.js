var TouchUI = function() {
	this.core.init.call(this);
	this.knockout.viewModel.call(this);
	this.knockout.bindings.call(this);
	return this.core.bridge.call(this);
};

TouchUI.prototype = {
	constructor: TouchUI,
	isActive: ko.observable(false),

	settings: {
		id: "touch",
		version: 0,
		requiredBootloaderVersion: 1,

		isFullscreen: ko.observable(false),
		isTouchscreen: ko.observable(false),

		isEpiphanyOrKweb: (window.navigator.userAgent.indexOf("AppleWebKit") !== -1 && window.navigator.userAgent.indexOf("ARM Mac OS X") !== -1),
		isChromiumArm: (window.navigator.userAgent.indexOf("X11") !== -1 && window.navigator.userAgent.indexOf("Chromium") !== -1 && window.navigator.userAgent.indexOf("armv7l") !== -1 || window.navigator.userAgent.indexOf("TouchUI") !== -1),

		hasFullscreen: ko.observable(document.webkitCancelFullScreen || document.msCancelFullScreen || document.oCancelFullScreen || document.mozCancelFullScreen || document.cancelFullScreen),
		hasLocalStorage: ('localStorage' in window),
		hasTouch: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0),

		canLoadAutomatically: ($("#loadsomethingsomethingdarkside").length > 0),
		touchuiModal: $('#touchui_settings_dialog'),

		whatsNew: ko.observable(false)
	},

	core: {},
	components: {},
	knockout: {},
	plugins: {},
	animate: {
		isHidebarActive: ko.observable(false)
	},
	DOM: {
		create: {},
		move: {},
		overwrite: {}
	},
	scroll: {

		defaults: {
			iScroll: {
				eventPassthrough: 'horizontal',
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true
			}
		},

		iScrolls: {},
		currentActive: null
	}

}

TouchUI.prototype.animate.hide = function(what) {
	var self = this;

	//Lets hide the navbar by scroll
	if( what === "navbar" ) {
		if( this.animate.isHidebarActive() ) {
			var navbar = $("#navbar"),
				navbarHeight = parseFloat(navbar.height());

			if( this.settings.hasTouch ) {
				// Hide navigation bar on mobile
				window.scrollTo(0,1);

				if(parseFloat($("html,body").prop('scrollHeight')) > ($(window).height() + navbarHeight)) {//hasEnoughScroll?
					$("html,body").stop().animate({
						scrollTop: navbarHeight
					}, 160, "swing");
				}

			} else {
				var scroll = self.scroll.iScrolls.body;

				if(scroll.isAnimating) {
					setTimeout(function() {
						self.animate.hide.call(self, what);
					}, 10);
					return;
				}

				setTimeout(function() {
					if(Math.abs(scroll.maxScrollY) > 0) {
						scroll.scrollTo(0, -navbarHeight, 160);
					}
				}, 0);

			}
		}
	}

}

TouchUI.prototype.components.dropdown = {

	init: function() {
		this.components.dropdown.toggleSubmenu.call( this );
		this.components.dropdown.toggle.call( this );
	},

	// Rewrite opening of dropdowns
	toggle: function() {
		var self = this;
		var namespace = ".touchui.dropdown";

		$(document)
			.off('.dropdown')
			.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
			.on('click.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
				var $dropdownToggle = $(e.currentTarget);
				var $dropdownContainer = $dropdownToggle.parent();

				// Stop the hashtag from propagating
				e.preventDefault();

				// Toggle the targeted dropdown
				$dropdownContainer.toggleClass("open");

				// Refresh current scroll and add a min-height so we can reach the dropdown if needed
				self.components.dropdown.containerMinHeight.call(self, $dropdownContainer, $dropdownToggle);

				// Skip everything if we are in a dropdown toggling a dropdown (one click event is enuff!)
				if( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) {
					return;
				}

				// Remove all other active dropdowns
				$('.open [data-toggle="dropdown"]').not($dropdownToggle).parent().removeClass('open');

				if ( !self.settings.hasTouch ) {
					self.scroll.iScrolls.terminal.disable();
				}

				$(document).off("click"+namespace).on("click"+namespace, function(eve) {
					// Check if we scrolled (touch devices wont trigger this click event after scrolling so assume we didn't move)
					var moved = ( !self.settings.hasTouch ) ? self.scroll.currentActive.moved : false,
						$target = $(eve.target);

					if (
						!moved && // If scrolling did not move
						$target.parents(".ui-pnotify").length === 0 && // if not a click within notifiaction
						(
							!$target.parents().is($dropdownContainer) || // if clicks are not made within the dropdown container
							$target.is('a:not([data-toggle="dropdown"])') // Unless it's a link but not a [data-toggle]
						)
					) {
						$(document).off(eve);
						$dropdownContainer.removeClass('open');

						if ( !self.settings.hasTouch ) {
							$('.octoprint-container').css("min-height", 0);
							self.scroll.currentActive.refresh();
							self.scroll.iScrolls.terminal.enable();
						}
					}
				});
			});

	},

	// Support 1.3.0 onMouseOver dropdowns
	toggleSubmenu: function() {
		$(".dropdown-submenu").addClass("dropdown");
		$(".dropdown-submenu > a").attr("data-toggle", "dropdown");
	},

	// Refresh current scroll and add a min-height so we can reach the dropdown if needed
	containerMinHeight: function($dropdownContainer, $dropdownToggle) {
		var self = this;

		// Touch devices can reach the dropdown by CSS, only if we're using iScroll
		if ( !self.settings.hasTouch ) {
			// Get active container
			var $container = ($dropdownContainer.parents('.modal').length === 0 ) ? $('.octoprint-container') : $dropdownContainer.parents('.modal .modal-body');

			// If we toggle within the dropdown then get the parent dropdown for total height
			var $dropdownMenu = ( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) ? $dropdownContainer.parents('.open > .dropdown-menu') : $dropdownToggle.next();

			setTimeout(function() {

				//If the main dropdown has closed (by toggle) then let's remove the min-height else
				if(!$dropdownMenu.parent().hasClass("open")) {
					$container.css("min-height", 0);
					self.scroll.currentActive.refresh();
				} else {
					var y = Math.abs(self.scroll.currentActive.y),
						height = $dropdownMenu.outerHeight(),
						top = $dropdownMenu.offset().top;

					$container.css("min-height", y + top + height);
					self.scroll.currentActive.refresh();
				}

			}, 0);
		}
	}

}

TouchUI.prototype.components.fullscreen = {
	init: function() {
		var self = this;

		// Bind fullscreenChange to knockout
		$(document).bind("fullscreenchange", function() {
			self.settings.isFullscreen($(document).fullScreen() !== false);
			self.DOM.storage.set("fullscreen", self.settings.isFullscreen());
		});

	}
}

TouchUI.prototype.components.keyboard = {

	isActive: ko.observable(false),
	config: {

		default: {

			display: {
				'accept' :  "Save",
				'bksp'   :  " ",
				'default': 'ABC',
				'meta1'  : '.?123',
				'meta2'  : '#+='
			},

			layout: 'custom',
			customLayout: {
				'default': [
					'q w e r t y u i o p',
					'a s d f g h j k l',
					'{bksp} {s} z x c v b n m',
					'{accept} {c} {left} {right} {meta1} {space}'
				],
				'shift': [
					'Q W E R T Y U I O P',
					'A S D F G H J K L',
					'{bksp} {s} Z X C V B N M',
					'{accept} {c} {left} {right} {meta1} {space}'
				],
				'meta1': [
					'1 2 3 4 5 6 7 8 9 0',
					'- / : ; ( ) \u20ac & @',
					'{bksp} {meta2} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				],
				'meta2': [
					'[ ] { } # % ^ * + =',
					'_ \\ | ~ < > $ \u00a3 \u00a5',
					'{bksp} {meta1} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				]
			}

		},
		terminal: {
			display: {
				'bksp'   :  " ",
				'accept' : 'Save',
				'default': 'ABC',
				'meta1'  : '.?123',
				'meta2'  : '#+='
			},

			layout: 'custom',
			customLayout: {
				'default': [
					'Q W E R T Y U I O P',
					'A S D F G H J K L',
					'{bksp} {s} Z X C V B N M',
					'{accept} {c} {left} {right} {meta1} {space}'
				],
				'meta1': [
					'1 2 3 4 5 6 7 8 9 0',
					'- / : ; ( ) \u20ac & @',
					'{bksp} {meta2} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				],
				'meta2': [
					'[ ] { } # % ^ * + =',
					'_ \\ | ~ < > $ \u00a3 \u00a5',
					'{bksp} {meta1} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				]
			}

		},
		number: {
			display: {
				'bksp'   :  " ",
				'a'      :  "Save",
				'c'      :  "Cancel"
			},

			layout: 'custom',
			customLayout: {
				'default' : [
					'{bksp} 1 2 3 4 5 6 7 ',
					'{accept} {c} {left} {right} 8 9 0 - , . '
				]
			},
		}


	},

	init: function() {
		var self = this;

		// Add virtual keyboard
		var obj = {
			visible: self.components.keyboard.onShow,
			beforeClose: self.components.keyboard.onClose
		};

		var notThis = ['[type="file"]','[type="checkbox"]','[type="radio"]'];
		$(document).on("mousedown", 'input:not('+notThis+'), textarea', function(e) {
			var $elm = $(e.target);

			if(!self.components.keyboard.isActive()) {

				if($elm.data("keyboard")) {
					$elm.data("keyboard").close().destroy();
				}

			} else {

				if(!self.settings.hasTouch) {

					// Force iScroll to stop following the mouse (bug)
					self.scroll.currentActive._end(e);
					setTimeout(function() {
						self.scroll.currentActive.scrollToElement($elm[0], 200, 0, -30);
					}, 0);

				}

				// $elm already has a keyboard
				if($elm.data("keyboard")) {
					$elm.data('keyboard').reveal();
					return;
				}

				if($elm.attr("type") === "number") {
					$elm.keyboard($.extend(self.components.keyboard.config.number, obj));
				} else if($elm.attr("id") === "terminal-command") {
					$elm.keyboard($.extend(self.components.keyboard.config.terminal, obj));
				} else {
					$elm.keyboard($.extend(self.components.keyboard.config.default, obj));
				}
			}

		});
	},

	onShow: function(event, keyboard, el) {
		// Set the input cursor to the end of the input field
		setTimeout(function() {
			var prev = keyboard.$preview.get(0);
			if (prev) {
				prev.selectionStart = prev.selectionEnd = prev.value.length;
			}
		}, 10);
		
		keyboard.$keyboard.find("button").on("mousedown", function(e) {
			$(e.target).addClass("touch-focus");

			if(typeof $(e.target).data("timeout") !== "function") {
				clearTimeout($(e.target).data("timeout"));
			}
			var timeout = setTimeout(function() {
				$(e.target).removeClass("touch-focus").data("timeout", "");
			}, 600);
			$(e.target).data("timeout", timeout);
		});
	},

	onClose: function(event, keyboard, el) {
		keyboard.$keyboard.find("button").off("mousedown");
	}

}

TouchUI.prototype.components.modal = {

	init: function() {
		if($("#settings_dialog_menu").length > 0) {
			this.components.modal.dropdown.create.call(this, "#settings_dialog_menu", "special-dropdown-uni", "#settings_dialog_label");
		}
		if($("#usersettings_dialog ul.nav").length > 0) {
			this.components.modal.dropdown.create.call(this, "#usersettings_dialog ul.nav", "special-dropdown-uni-2", "#usersettings_dialog h3");
		}
	},

	dropdown: {
		create: function(cloneId, newId, appendTo) {
			var self = this;

			// Remove unwanted whitespaces
			$(appendTo).text($(appendTo).text().trim());

			// Create a label that is clickable
			var $settingsLabel = $("<span></span>")
				.addClass("hidden")
				.attr("id", newId)
				.appendTo(appendTo)
				.text($(cloneId+" .active").text().trim())
				.on("click", function(e) {

					// Stop if we clicked on the dropdown and stop the dropdown from regenerating more then once
					if(e.target !== this || (e.target === this && $(".show-dropdown").length > 0)) {
						return;
					}

					// Clone the main settings menu
					var elm = $(cloneId)
						.clone()
						.attr("id", "")
						.appendTo(this)
						.addClass("show-dropdown");

					// Add click binder to close down the dropdown
					$(document).on("click", function(event) {

						if(
							$(event.target).closest('[data-toggle="tab"]').length > 0 || //Check if we clicked on a tab-link
							$(event.target).closest("#"+newId).length === 0 //Check if we clicked outside the dropdown
						) {
							var href = $settingsLabel.find(".active").find('[data-toggle="tab"]').attr("href");
							$(document).off(event).trigger("dropdown-closed.touchui"); // Trigger event for enabling scrolling

							$('.show-dropdown').remove();
							$('[href="'+href+'"]').click();
							$settingsLabel.text($('[href="'+href+'"]').text());

							if( !self.settings.hasTouch ) {
								setTimeout(function() {
									self.scroll.modal.stack[self.scroll.modal.stack.length-1].refresh();
								}, 0);
							}
						}

					});

					// Trigger event for disabling scrolling
					$(document).trigger("dropdown-open.touchui", elm[0]);
				});

			// reset the active text in dropdown on open
			$(appendTo)
				.closest(".modal")
				.on("modal.touchui", function() {
					var href = $(cloneId)
						.find(".active")
						.find('[data-toggle="tab"]')
						.attr("href");

					$settingsLabel.text($('[href="'+href+'"]').text());
				});

		}
	}
}

TouchUI.prototype.components.slider = {

	init: function() {

		ko.bindingHandlers.slider = {
			init: function (element, valueAccessor) {
				var $element = $(element);

				// Set value on input field
				$element.val(valueAccessor().value());

				// Create container
				var div = $('<div class="slider-container"></div>').insertBefore(element);

				// Wait untill next DOM bindings are executed
				setTimeout(function() {
					var $button = $(element).next('button');
					var id = _.uniqueId("ui-inp");

					$button.appendTo(div);
					$element.appendTo(div);

					$(div).find('input').attr("id", id);

					var lbl = $('<label for="' + id + '" style="display: inline-block;">' + $button.text().split(":")[0].replace(" ", "") + ':</label>');
					lbl.appendTo('.octoprint-container')
					$element.attr("style", "padding-left:" + (lbl.width() + 15) + "px");
					lbl.appendTo(div);

				}, 60);

				$element.on("change", function(e) {
					valueAccessor().value(parseFloat($element.val()));
				}).attr({
					max: valueAccessor().max,
					min: valueAccessor().min,
					step: valueAccessor().step,
				});

			},
			update: function (element, valueAccessor) {
				$(element).val(parseFloat(valueAccessor().value()));
			}
		};

	}

}

TouchUI.prototype.components.touchList = {
	init: function() {

		/* Add touch friendly files list */
		var self = this;
		var touch = false;
		var start = 0;
		var namespace = ".files.touchui";

		$(document).on("mousedown touchstart", "#files .entry:not(.folder, .back), #temp .row-fluid", function(e) {
			try {
				touch = e.currentTarget;
				start = e.pageX || e.originalEvent.targetTouches[0].pageX;
			} catch(err) {
				return;
			}

			$(document).one("mouseup"+namespace+" touchend"+namespace, function(e) {
				touch = false;
				start = 0;

				$(document).off(namespace);
			});

			$(document).on("mousemove"+namespace+" touchmove"+namespace, function(event) {
				if(touch !== false) {
					try {
						var current = event.pageX || event.originalEvent.targetTouches[0].pageX;

						if(current > start + 80) {
							$(document).trigger("fileclose" + namespace, event.target);
							$(touch).removeClass("open");
							start = current;
						} else if(current < start - 80) {
							$(document).trigger("fileopen" + namespace, event.target);
							$(touch).addClass("open");
							start = current;

							if( $(touch).find(".btn-group").children().length > 4 ) {
								$(touch).addClass("large");
							}
						}
					} catch(err) {
						//Ignore step
					}
				}
			});

		});

	}

}

TouchUI.prototype.components.touchscreen = {

	init: function () {
		$("html").addClass("isTouchscreenUI");
		
		if (this.settings.isEpiphanyOrKweb) {
			this.settings.hasTouch = false;
			this.scroll.defaults.iScroll.disableTouch = true;
			this.scroll.defaults.iScroll.disableMouse = false;
		}
		
		this.settings.isTouchscreen(true);

		if (this.settings.isEpiphanyOrKweb || this.settings.isChromiumArm) {
			this.settings.hasFullscreen(false);
		}
		
		$('.modal.fade').removeClass('fade');
		$('#gcode_link').remove();

		// Improve performace
		this.scroll.defaults.iScroll.scrollbars = false;
		this.scroll.defaults.iScroll.interactiveScrollbars = false;
		this.scroll.defaults.iScroll.useTransition = false;
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
				console.info("TouchUI: GCodeViewer is disabled while TouchUI is active and in touchscreen mode.");
				viewModels.gcodeViewModel.enabled = false;
				viewModels.gcodeViewModel.initialize = _.noop;
				viewModels.gcodeViewModel.clear = _.noop;
				viewModels.gcodeViewModel._processData = _.noop;
			}
		}

	}

}

TouchUI.prototype.core.init = function() {

	// Migrate old cookies into localstorage
	this.DOM.storage.migration.call(this);

	// Bootup TouchUI if Touch, Small resolution or storage say's so
	if (this.core.boot.call(this)) {

		// Send Touchscreen loading status
		if (window.top.postMessage) {
			window.top.postMessage("loading", "*");
			
			$(window).on("error.touchui", function(event) {
				window.top.postMessage([event.originalEvent.message, event.originalEvent.filename], "*");
			});
		}

		// Attach id for TouchUI styling
		$("html").attr("id", this.settings.id);

		// Force mobile browser to set the window size to their format
		$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
		$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
		$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");

		this.isActive(true);

		// Enforce active cookie
		this.DOM.storage.set("active", true);

		// Create keyboard cookie if not existing
		if (this.DOM.storage.get("keyboardActive") === undefined) {
			if (!this.settings.hasTouch || this.settings.isChromiumArm) {
				this.DOM.storage.set("keyboardActive", true);
			} else {
				this.DOM.storage.set("keyboardActive", false);
			}
		}

		// Create hide navbar on click if not existing
		if (this.DOM.storage.get("hideNavbarActive") === undefined) {
			this.DOM.storage.set("hideNavbarActive", false);
		}

		// Treat KWEB3 as a special Touchscreen mode or enabled by cookie
		if (
			(
				this.settings.isEpiphanyOrKweb || 
				this.settings.isChromiumArm && 
				this.DOM.storage.get("touchscreenActive") === undefined
			) || 
			this.DOM.storage.get("touchscreenActive")
		) {
			this.components.touchscreen.init.call(this);
		}

		// If TouchUI has been started through bootloader then initialize the process during reloads
		if (this.settings.isChromiumArm && window.top.postMessage) {
			window.onbeforeunload = function(event) {
				window.top.postMessage("reset", "*");
			};
		}

		// Get state of cookies and store them in KO
		this.components.keyboard.isActive(this.DOM.storage.get("keyboardActive"));
		this.animate.isHidebarActive(this.DOM.storage.get("hideNavbarActive"));
		this.settings.isFullscreen($(document).fullScreen() !== false);
	}

}

TouchUI.prototype.core.boot = function() {

	// This should always start TouchUI
	if(
		document.location.hash === "#touch" ||
		document.location.href.indexOf("?touch") > 0 ||
		this.DOM.storage.get("active") ||
		this.settings.isChromiumArm
	) {

		return true;

	} else if(
		this.settings.canLoadAutomatically &&
		this.DOM.storage.get("active") !== false
	) {

		if($(window).width() < 980) {
			return true;
		}

		if(this.settings.hasTouch) {
			return true;
		}

	}

	return false;

}

TouchUI.prototype.core.bridge = function() {
	var self = this;

	this.core.bridge = {

		allViewModels: {},
		TOUCHUI_REQUIRED_VIEWMODELS: [
			"terminalViewModel",
			"connectionViewModel",
			"settingsViewModel",
			"softwareUpdateViewModel",
			"controlViewModel",
			"gcodeFilesViewModel",
			"navigationViewModel",
			"pluginManagerViewModel",
			"temperatureViewModel",
			"loginStateViewModel"
		],
		TOUCHUI_ELEMENTS: [
			"#touchui_settings_dialog",
			"#settings_plugin_touchui",
			"#navbar_plugin_touchui"
		],

		domLoading: function() {
			if (self.isActive()) {
				self.scroll.beforeLoad.call(self);
				self.DOM.init.call(self);

				if (moment && moment.locale) {
					// Overwrite the 'moment.locale' fuction and call original:
					// The purpose is that we want to remove data before
					// registering it to OctoPrint. Moment.locale is called
					// just before this happens.
					var old = moment.locale;
					moment.locale = function() {
						self.plugins.tempsGraph.call(self);
						old.apply(moment, arguments);
					};
				}
			}
		},

		domReady: function() {
			if (self.isActive()) {

				if($("#gcode").length > 0) {
					self.core.bridge.TOUCHUI_REQUIRED_VIEWMODELS = self.core.bridge.TOUCHUI_REQUIRED_VIEWMODELS.concat(["gcodeViewModel"]);
				}

				self.components.dropdown.init.call(self);
				self.components.fullscreen.init.call(self);
				self.components.keyboard.init.call(self);
				self.components.modal.init.call(self);
				self.components.touchList.init.call(self);
				self.components.slider.init.call(self);

				self.scroll.init.call(self);
			}
		},

		koStartup: function TouchUIViewModel(viewModels) {
			self.core.bridge.allViewModels = _.object(self.core.bridge.TOUCHUI_REQUIRED_VIEWMODELS, viewModels);
			self.knockout.isLoading.call(self, self.core.bridge.allViewModels);
			return self;
		}
	}

	return this.core.bridge;
}

TouchUI.prototype.core.less = {

	options: {
		template: {
			importUrl:	"./plugin/touchui/static/less/touchui.bundled.less?t=" + new Date().getTime(),
			import:		'@import "{importUrl}"; \n',
			variables:	"@main-color: {mainColor}; \n" +
						"@terminal-color: {termColor}; \n" +
						"@text-color: {textColor}; \n" +
						"@main-font-size: {fontSize}px; \n" +
						"@main-background: {bgColor}; \n\n"
		},
		API: "./plugin/touchui/css"
	},

	save: function() {
		var variables = "";
		var options = this.core.less.options;
		var self = this;

		if(self.settings.useCustomization()) {
			if(self.settings.colors.useLocalFile()) {

				$.get(options.API, {
						path: self.settings.colors.customPath()
					})
					.done(function(response) {
						self.core.less.render.call(self, options.template.import.replace("{importUrl}", options.template.importUrl) + response);
					})
					.error(function(error) {
						self.core.less.error.call(self, error);
					});

			} else {

				self.core.less.render.call(self, "" +
					options.template.import.replace("{importUrl}", options.template.importUrl) +
					options.template.variables.replace("{mainColor}", self.settings.colors.mainColor())
						.replace("{termColor}", self.settings.colors.termColor())
						.replace("{textColor}", self.settings.colors.textColor())
						.replace("{bgColor}", self.settings.colors.bgColor())
						.replace("{fontSize}", self.settings.colors.fontSize())
				);

			}
		}
	},

	render: function(data) {
		var self = this;
		var callback = function(error, result) {

				if (error) {
					self.core.less.error.call(self, error);
				} else {
					result.css = result.css.replace(/mixin\:placeholder\;/g, '');

					$.post(self.core.less.options.API, {
							css: result.css
						})
						.done(function() {
							self.settings.refreshCSS(true);
							$(window).trigger('resize');
						})
						.error(function(error) {
							self.core.less.error.call(self, error);
						});

				}
			}

		if(window.less.render) {
			window.less.render(data, {
				compress: true
			}, callback);
		} else {
			window.less.Parser({}).parse(data, function(error, result) {
				if(result) {
					result = {
						css: result.toCSS({
							compress: true
						})
					}
				}
				callback.call(this, error, result);
			});
		}
	},

	error: function(error) {
		var content = error.responseText;
		if(content && content.trim() && error.status !== 401) {
			new PNotify({
				title: 'TouchUI: Whoops, something went wrong...',
				text: content,
				icon: 'glyphicon glyphicon-question-sign',
				type: 'error',
				hide: false
			});
		}

	}

}

TouchUI.prototype.core.version = {

	init: function(softwareUpdateViewModel) {
		var self = this;

		$("<span></span>").appendTo("#terminal-output");

		if(softwareUpdateViewModel) {

			softwareUpdateViewModel.versions.items.subscribe(function(changes) {

				var touchui = softwareUpdateViewModel.versions.getItem(function(elm) {
					return (elm.key === "touchui");
				}, true) || false;

				if( touchui !== false && touchui.information !== null ) {
					var remote = Number(touchui.information.remote.value.split('.').join('')),
						local = Number(touchui.information.local.value.split('.').join(''));

					if(remote > local) {
						$("#touch_updates_css").remove();
						$('head').append('<style id="touch_updates_css">#term pre span:first-child:before{ content: "v'+touchui.information.local.value+" outdated, new version: v"+touchui.information.remote.value+'" !important; }</style>');
					} else {
						if( $("#touch_updates_css").length === 0 ) {
							$('head').append('<style id="touch_updates_css">#term pre span:first-child:before{ content: "v'+touchui.information.local.value+'" !important; }</style>');
						}
					}
				}

			});

		}

	}

}

TouchUI.prototype.DOM.init = function() {

	// Create new tab with printer status and make it active
	this.DOM.create.printer.init(this.DOM.create.tabbar);
	this.DOM.create.printer.menu.$elm.find('a').trigger("click");

	// Create a new persistent dropdown
	this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

	// Add a webcam tab if it's defined
	if ($("#webcam_container").length > 0) {
		this.DOM.create.webcam.init(this.DOM.create.tabbar);
	}

	// Move all other items from tabbar into dropdown
	this.DOM.move.navbar.init.call(this);
	this.DOM.move.tabbar.init.call(this);
	this.DOM.move.afterTabAndNav.call(this);
	this.DOM.move.overlays.init.call(this);
	this.DOM.move.terminal.init.call(this);

	// Move connection sidebar into a new modal
	this.DOM.move.connection.init(this.DOM.create.tabbar);

	// Manipulate controls div
	this.DOM.move.controls.init();

	// Disable these bootstrap/jquery plugins
	this.DOM.overwrite.tabdrop.call(this);
	this.DOM.overwrite.modal.call(this);
	this.DOM.overwrite.pnotify.call(this);

	// Add class with how many tab-items
	$("#tabs, #navbar").addClass("items-" + $("#tabs li:not(.hidden_touch)").length);

	// Remove active class when clicking on a tab in the tabbar
	$('#tabs [data-toggle=tab]').on("click", function() {
		$("#all_touchui_settings").removeClass("item_active");
	});

	// If touch emulator is enabled, then disable dragging of a menu item for scrolling
	if(!this.settings.hasTouch) {
		$("#navbar ul.nav > li a").on("dragstart drop", function(e) {
			return false;
		});
	}
}

TouchUI.prototype.DOM.cookies = {

	get: function(key, isPlain) {
		var name = (isPlain) ? key + "=" : "TouchUI." + key + "=";
		var ca = document.cookie.split(';');
		var tmp;
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) tmp = c.substring(name.length,c.length);
			return (isPlain) ? tmp : $.parseJSON(tmp);
			
		}
		return undefined;
	},

	set: function(key, value, isPlain) {
		key = (isPlain) ? key + "=" : "TouchUI." + key + "=";
		var d = new Date();
		d.setTime(d.getTime()+(360*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = key + value + "; " + expires;
	},

	toggleBoolean: function(key, isPlain) {
		var value = $.parseJSON(this.get(key, isPlain) || "false");

		if(value === true) {
			this.set(key, "false", isPlain);
		} else {
			this.set(key, "true", isPlain);
		}

		return !value;

	}

}

TouchUI.prototype.DOM.localstorage = {
	store: JSON.parse(localStorage["TouchUI"] || "{}"),

	get: function (key) {
		return this.store[key];
	},

	set: function (key, value) {
		this.store[key] = value;
		localStorage["TouchUI"] = JSON.stringify(this.store);
		return this.store[key];
	},

	toggleBoolean: function (key) {
		var value = this.store[key] || false;

		if(value === true) {
			this.set(key, false);
		} else {
			this.set(key, true);
		}

		return !value;

	}

}

// Since I messed up by releasing start_kweb3.xinit without disabling private
// mode, we now need to check if we can store anything at all in localstorage
// the missing -P will prevent any localstorage
if (TouchUI.prototype.settings.hasLocalStorage) {
	try {
		localStorage["TouchUIcanWeHazStorage"] = "true";
		TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.localstorage;
		delete localStorage["TouchUIcanWeHazStorage"];
	} catch(err) {

		// TODO: remove this is future
		if(TouchUI.prototype.settings.isEpiphanyOrKweb) {
			$(function() {
				new PNotify({
					type: 'error',
					title: "Private Mode detection:",
					text: "Edit the startup file 'start_kweb3.xinit' in '~/OctoPrint-TouchUI-autostart/' "+
						"and add the parameter 'P' after the dash. \n\n" +
						"For more information see the v0.3.3 release notes.",
					hide: false
				});
			});
		}

		console.info("Localstorage defined but failback to cookies due to errors.");
		TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.cookies;
	}
} else {
	TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.cookies;
}

TouchUI.prototype.DOM.storage.migration = (TouchUI.prototype.DOM.storage === TouchUI.prototype.DOM.localstorage) ? function migration() {

	if (this.settings.hasLocalStorage) {
		if (document.cookie.indexOf("TouchUI.") !== -1) {
			console.info("TouchUI cookies migration.");

			var name = "TouchUI.";
			var ca = document.cookie.split(';');
			for (var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) {
					var string = c.substring(name.length,c.length);
					string = string.split("=");
					var value = $.parseJSON(string[1]);

					console.info("Saving cookie", string[0], "with value", value, "to localstorage.");
					this.DOM.storage.set(string[0], value);

					console.info("Removing cookie", string[0]);
					document.cookie = "TouchUI." + string[0] + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
				}
			}
		}
	}

} : _.noop;

// Auto-Login with localStorage
if (localStorage) {
	if (localStorage["remember_token"] && !TouchUI.prototype.DOM.cookies.get("remember_token", true)) {
		TouchUI.prototype.DOM.cookies.set("remember_token", localStorage["remember_token"], true)
	}
}

TouchUI.prototype.knockout.bindings = function() {
	var self = this;

	this.bindings = {

		toggleTouch: function() {
			if (self.DOM.storage.toggleBoolean("active")) {
				document.location.hash = "#touch";
			} else {
				document.location.hash = "";
			}
			document.location.reload();
		},

		toggleKeyboard: function() {
			if (self.isActive()) {
				self.components.keyboard.isActive(self.DOM.storage.toggleBoolean("keyboardActive"));
			}
		},

		toggleHidebar: function() {
			if (self.isActive()) {
				self.animate.isHidebarActive(self.DOM.storage.toggleBoolean("hideNavbarActive"));
			}
		},

		toggleFullscreen: function() {
			$(document).toggleFullScreen();
		},

		toggleTouchscreen: function() {
			if (self.isActive()) {
				self.settings.isTouchscreen(self.DOM.storage.toggleBoolean("touchscreenActive"));
				document.location.reload();
			}
		},

		show: function() {
			self.settings.touchuiModal.modal("show");
		}

	}

}

TouchUI.prototype.knockout.isLoading = function (viewModels) {
	var self = this;

	if(self.isActive()) {
		self.components.touchscreen.isLoading.call(self, viewModels);

		// Reload dimensions of webcam with onload event
		// Legacy code from 1.3.3
		// Fixes bug #78
		if(viewModels.controlViewModel && viewModels.controlViewModel.updateRotatorWidth) {
			$("#webcam_image").on("load", function() {
				viewModels.controlViewModel.updateRotatorWidth();
			});
		}

		// Prevent user from double clicking in a short period on buttons
		$(document).on("click", "button:not(#login_button, .box, .distance, .dropdown-toggle, .btn-input-inc, .btn-input-dec, .temperature_target .btn-group button)", function(e) {
			var printer = $(e.target);
			printer.prop('disabled', true);

			setTimeout(function() {
				printer.prop('disabled', false);
			}, 600);
		});

		// Update scroll area if new items arrived
		if( !self.settings.hasTouch ) {
			viewModels.gcodeFilesViewModel.listHelper.paginatedItems.subscribe(function(a) {
				setTimeout(function() {
					self.scroll.iScrolls.body.refresh();
				}, 300);
			});
		}

		// Watch the operational binder for visual online/offline
		viewModels.connectionViewModel.isOperational.subscribe(function(newOperationalState) {
			var printLink = $("#all_touchui_settings");
			if( !newOperationalState ) {
				printLink.addClass("offline").removeClass("online");
				$("#conn_link2").addClass("offline").removeClass("online");
			} else {
				printLink.removeClass("offline").addClass("online");
				$("#conn_link2").removeClass("offline").addClass("online");
			}
		});
	}

	// Check if we can show whats new in this version
	self.settings.whatsNew.subscribe(function(whatsNew) {
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

}

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

TouchUI.prototype.knockout.viewModel = function() {
	var self = this;

	// Subscribe to OctoPrint events
	self.onStartupComplete = function () {
		if (self.isActive()) {
			self.DOM.overwrite.tabbar.call(self);
		}
		self.knockout.isReady.call(self, self.core.bridge.allViewModels);
		if (self.isActive()) {
			self.plugins.init.call(self, self.core.bridge.allViewModels);
		}
	}

	self.onBeforeBinding = function() {
		ko.mapping.fromJS(self.core.bridge.allViewModels.settingsViewModel.settings.plugins.touchui, {}, self.settings);
	}

	self.onSettingsBeforeSave = function() {
		self.core.less.save.call(self);
	}

	self.onTabChange = function() {
		if (self.isActive()) {
			self.animate.hide.call(self, "navbar");

			if(!self.settings.hasTouch && self.scroll.currentActive) {
				self.scroll.currentActive.refresh();
				setTimeout(function() {
					self.scroll.currentActive.refresh();
				}, 0);
			}
		}
	}
	
	// Auto-Login with localStorage
	self.onBrowserTabVisibilityChange = function() {
		if (localStorage) {
			if (localStorage["remember_token"] && !self.DOM.cookies.get("remember_token", true)) {
				self.DOM.cookies.set("remember_token", localStorage["remember_token"], true)
			}
		}
	}

}

TouchUI.prototype.plugins.init = function (viewModels) {
	this.plugins.screenSquish(viewModels.pluginManagerViewModel);
}

TouchUI.prototype.plugins.navbarTemp = function() {}

TouchUI.prototype.plugins.psuControl = function() {

	// Manually move navbar temp (hard move)
	if( $("#navbar_plugin_psucontrol a").length > 0 ) {
		$("#navbar_plugin_psucontrol a")
			.text('PSU Control');
	}

}

TouchUI.prototype.plugins.screenSquish = function(pluginManagerViewModel) {
	var shown = false;

	pluginManagerViewModel.plugins.items.subscribe(function() {

		var ScreenSquish = pluginManagerViewModel.plugins.getItem(function(elm) {
			return (elm.key === "ScreenSquish");
		}, true) || false;

		if(!shown && ScreenSquish && ScreenSquish.enabled) {
			shown = true;
			new PNotify({
				title: 'TouchUI: ScreenSquish is running',
				text: 'Running ScreenSquish and TouchUI will give issues since both plugins try the same, we recommend turning off ScreenSquish.',
				icon: 'glyphicon glyphicon-question-sign',
				type: 'error',
				hide: false,
				confirm: {
					confirm: true,
					buttons: [{
						text: 'Disable ScreenSquish',
						addClass: 'btn-primary',
						click: function(notice) {
							if(!ScreenSquish.pending_disable) {
								pluginManagerViewModel.togglePlugin(ScreenSquish);
							}
							notice.remove();
						}
					}]
				},
			});
		}

	});

};

TouchUI.prototype.plugins.tempsGraph = function() {
	_.remove(OCTOPRINT_VIEWMODELS, function(obj) {
		if (obj[0] && obj[0].name === "TempsgraphViewModel") {
			console.info("TouchUI: TempsGraph is disabled while TouchUI is active.");
			return true;
		}
		
		return false;
	});

}

TouchUI.prototype.scroll.beforeLoad = function() {

	// Manipulate DOM for iScroll before knockout binding kicks in
	if (!this.settings.hasTouch) {
		$('<div id="scroll"></div>').insertBefore('.page-container');
		$('.page-container').appendTo("#scroll");
	}

}

TouchUI.prototype.scroll.init = function() {
	var self = this;

	if ( this.settings.hasTouch ) {
		var width = $(window).width();

		// Covert VH to the initial height (prevent height from jumping when navigation bar hides/shows)
		$("#temperature-graph").parent().height($("#temperature-graph").parent().outerHeight());
		$("#terminal-scroll").height($("#terminal-scroll").outerHeight());
		$("#terminal-sendpanel").css("top", $("#terminal-scroll").outerHeight()-1);

		$(window).on("resize", function() {

			if(width !== $(window).width()) {
				$("#temperature-graph").parent().height($("#temperature-graph").parent().outerHeight());
				$("#terminal-scroll").css("height", "").height($("#terminal-scroll").outerHeight());
				$("#terminal-sendpanel").css("top", $("#terminal-scroll").outerHeight()-1);
				width = $(window).width();
			}


		});

	} else {

		// Set overflow hidden for best performance
		$("html").addClass("emulateTouch");

		self.scroll.terminal.init.call(self);
		self.scroll.body.init.call(self);
		self.scroll.modal.init.call(self);
		self.scroll.overlay.init.call(self);

		$(document).on("slideCompleted", function() {
			self.scroll.currentActive.refresh();
		});

		// Refresh body on dropdown click
		$(document).on("click", ".pagination ul li a", function() {
			setTimeout(function() {
				self.scroll.currentActive.refresh();
			}, 0);
		});

	}

}

TouchUI.prototype.scroll.blockEvents = {
	className: "no-pointer",

	scrollStart: function($elm, iScrollInstance) {
		$elm.addClass(this.className);
	},

	scrollEnd: function($elm, iScrollInstance) {
		$elm.removeClass(this.className);
		iScrollInstance.refresh();
	}

}

TouchUI.prototype.scroll.body = {

	init: function() {
		var self = this;
		var scrollStart = false;
		var $noPointer = $('.page-container');

		// Create main body scroll
		self.scroll.iScrolls.body = new IScroll("#scroll", self.scroll.defaults.iScroll);
		self.scroll.currentActive = self.scroll.iScrolls.body;

		// Block everthing while scrolling
		var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $noPointer, self.scroll.iScrolls.body),
			scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $noPointer, self.scroll.iScrolls.body);

		// Disable all JS events while scrolling for best performance
		self.scroll.iScrolls.body.on("scrollStart", scrollStart);
		self.scroll.iScrolls.body.on("onBeforeScrollStart", scrollStart);
		self.scroll.iScrolls.body.on("scrollEnd", scrollEnd);
		self.scroll.iScrolls.body.on("scrollCancel", scrollEnd);

		// Prevent any misfortune
		$(document).on("mouseup.prevent.pointer touchend.prevent.pointer", function() {
			$noPointer.removeClass('no-pointer');
		});

	}

}

TouchUI.prototype.scroll.modal = {
	stack: [],
	dropdown: null,

	init: function() {
		var $document = $(document),
			self = this;

		$document.on("modal.touchui", function(e, elm) {
			var $modalElm = $(elm),
				$modalContainer = $(elm).parent();

			// Create temp iScroll within the modal
			var curModal = new IScroll($modalContainer[0], self.scroll.defaults.iScroll);

			// Store into stack
			self.scroll.modal.stack.push(curModal);
			self.scroll.currentActive = curModal;

			// Force iScroll to get the correct scrollHeight
			setTimeout(function() {
				if(curModal) {
					curModal.refresh();
				}
			}, 0);
			// And Refresh again after animation
			setTimeout(function() {
				if(curModal) {
					curModal.refresh();
				}
			}, 800);

			// Store bindings into variable for future reference
			var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $modalElm, curModal),
				scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $modalElm, curModal);

			// Disable all JS events while scrolling for best performance
			curModal.on("scrollStart", scrollStart);
			curModal.on("scrollEnd", scrollEnd);
			curModal.on("scrollCancel", scrollEnd);

			// Refresh the scrollHeight and scroll back to top with these actions:
			$document.on("click.scrollHeightTouchUI", '[data-toggle="tab"], .pagination ul li a', function(e) {
				curModal._end(e);

				setTimeout(function() {
					curModal.refresh();
					curModal.scrollTo(0, 0);
				}, 0);
			});

			// Kill it with fire!
			$modalElm.one("destroy", function() {
				$document.off("click.scrollHeightTouchUI");
				self.scroll.modal.stack.pop();

				if(self.scroll.modal.stack.length > 0) {
					self.scroll.currentActive = self.scroll.modal.stack[self.scroll.modal.stack.length-1];
				} else {
					self.scroll.currentActive = self.scroll.iScrolls.body;
				}

				curModal.destroy();
				curModal.off("scrollStart", scrollStart);
				curModal.off("scrollEnd", scrollEnd);
				curModal.off("scrollCancel", scrollEnd);
				curModal = undefined;
			});

		});

		// Triggered when we create the dropdown and need scrolling
		$document.on("dropdown-open.touchui", function(e, elm) {
			var $elm = $(elm);

			// Create dropdown scroll
			self.scroll.modal.dropdown = new IScroll(elm, {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale"
			});

			// Set scroll to active item
			self.scroll.modal.dropdown.scrollToElement($elm.find('li.active')[0], 0, 0, -30);

			// Disable scrolling in active modal
			self.scroll.modal.stack[self.scroll.modal.stack.length-1].disable();

			// Store bindings into variable for future reference
			var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $elm, self.scroll.modal.dropdown),
				scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.modal.dropdown);

			// Disable all JS events for smooth scrolling
			self.scroll.modal.dropdown.on("scrollStart", scrollStart);
			self.scroll.modal.dropdown.on("scrollEnd", scrollEnd);
			self.scroll.modal.dropdown.on("scrollCancel", scrollEnd);

			$document.on("dropdown-closed.touchui", function() {
				// Enable active modal
				self.scroll.modal.stack[self.scroll.modal.stack.length-1].enable();

				self.scroll.modal.dropdown.off("scrollStart", scrollStart);
				self.scroll.modal.dropdown.off("scrollEnd", scrollEnd);
				self.scroll.modal.dropdown.off("scrollCancel", scrollEnd);
			});

		});

	}
}

TouchUI.prototype.scroll.overlay = {

	mainItems: ['#offline_overlay', '#reloadui_overlay'],
	init: function() {
		var self = this;

		self.scroll.iScrolls.overlay = [];

		var $items = $(this.scroll.overlay.mainItems);
		$items.each(function(ind, elm) {
			var child = $(elm).children("#" + $(elm).attr("id") + "_wrapper");
			var div = $('<div></div>').prependTo(elm);
			child.appendTo(div);

			$(elm).addClass("iscroll");

			self.scroll.iScrolls.overlay[ind] = new IScroll(elm, self.scroll.defaults.iScroll);
		});

	},

	refresh: function() {
		var self = this;

		setTimeout(function() {
			$.each(self.scroll.iScrolls.overlay, function(ind) {
				self.scroll.iScrolls.overlay[ind].refresh();
			});
		}, 0);

	}

}

TouchUI.prototype.scroll.overwrite = function(terminalViewModel) {
	var self = this;

	if ( !this.settings.hasTouch ) {

		// Enforce no scroll jumping
		$("#scroll").on("scroll", function() {
			if($("#scroll").scrollTop() !== 0) {
				$("#scroll").scrollTop(0);
			}
		});

		// Refresh terminal scroll height
		terminalViewModel.displayedLines.subscribe(function() {
			self.scroll.iScrolls.terminal.refresh();
		});

		// Overwrite scrollToEnd function with iScroll functions
		terminalViewModel.scrollToEnd = function() {
			self.scroll.iScrolls.terminal.refresh();
			self.scroll.iScrolls.terminal.scrollTo(0, self.scroll.iScrolls.terminal.maxScrollY);
		};

		// Overwrite orginal helper, add one step and call the orginal function
		var showOfflineOverlay = window.showOfflineOverlay;
		window.showOfflineOverlay = function(title, message, reconnectCallback) {
			showOfflineOverlay.call(this, title, message, reconnectCallback);
			self.scroll.overlay.refresh.call(self);
		};

		// Overwrite orginal helper, add one step and call the orginal function
		var showConfirmationDialog = window.showConfirmationDialog;
		window.showConfirmationDialog = function(message, onacknowledge) {
			self.scroll.iScrolls.body.scrollTo(0, 0, 500);
			showConfirmationDialog.call(this, message, onacknowledge);
		};

		// Overwrite orginal helper, add one step and call the orginal function
		var showReloadOverlay = $.fn.show;
		$.fn.show = function(e,r,i) {
			if($(this).hasClass("iscroll")) {
				setTimeout(function() {
					self.scroll.overlay.refresh.call(self);
				}, 0);
			}

			return showReloadOverlay.call(this,e,r,i);
		}

	} else {

		// Overwrite scrollToEnd function with #terminal-scroll as scroller
		terminalViewModel.scrollToEnd = function() {
			var $container = $("#terminal-scroll");
			if ($container.length) {
				$container.scrollTop($container[0].scrollHeight - $container.height())
			}
		}

	}
}

TouchUI.prototype.scroll.terminal = {

	init: function() {
		var self = this;

		// Create scrolling for terminal
		self.scroll.iScrolls.terminal = new IScroll("#terminal-scroll", self.scroll.defaults.iScroll);

		// Enforce the right scrollheight and disable main scrolling if we have a scrolling content
		self.scroll.iScrolls.terminal.on("beforeScrollStart", function() {
			self.scroll.iScrolls.terminal.refresh();

			if(this.hasVerticalScroll) {
				self.scroll.iScrolls.body.disable();
			}
		});
		self.scroll.iScrolls.terminal.on("scrollEnd", function() {
			self.scroll.iScrolls.body.enable();
		});

	}
}

TouchUI.prototype.DOM.create.dropdown = {

	menuItem: {
		cloneTo: $('#navbar ul.nav')
	},
	container: null,

	init: function() {

		this.menuItem.menu = $('' +
			'<li id="all_touchui_settings" class="dropdown">' +
				'<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
					$('navbar_show_settings').text() || $('navbar_show_settings').attr("title") +
				'</a>' +
			'</li>').prependTo(this.menuItem.cloneTo);

		this.container = $('<ul class="dropdown-menu"></ul>').appendTo(this.menuItem.menu);
	}

}

TouchUI.prototype.DOM.create.printer = {

	menu: {
		cloneTo: "#tabs"
	},

	container: {
		cloneTo: "#temp"
	},

	move: {
		$state: $("#state_wrapper"),
		$files: $("#files_wrapper")
	},

	init: function( tabbar ) {
		this.menu.$elm = tabbar.createItem("print_link", "printer", "tab").prependTo(this.menu.cloneTo);
		this.container.$elm = $('<div id="printer" class="tab-pane active"><div class="row-fluid"></div></div>').insertBefore(this.container.cloneTo);

		// Move the contents of the hidden accordions to the new print status and files tab
		this.move.$state.appendTo(this.container.$elm.find(".row-fluid"));
		this.move.$files.insertAfter(this.container.$elm.find(".row-fluid #state_wrapper"));
	}

}

TouchUI.prototype.DOM.create.tabbar = {

	createItem: function(itemId, linkId, toggle, text) {
		text = (text) ? text : "";
		return $('<li id="'+itemId+'"><a href="#'+linkId+'" data-toggle="'+toggle+'">'+text+'</a></li>');

	}
}

TouchUI.prototype.DOM.create.webcam = {

	menu: {
		webcam: {
			cloneTo: "#tabs #control_link"
		}
	},

	container: {
		cloneTo: "#tabs + .tab-content",

		webcam: {
			$container: $("#webcam_container"),
			cloneTo: "#webcam"
		}
	},

	init: function( tabbar ) {
		this.container.$elm = $('<div id="webcam" class="tab-pane"></div>').appendTo(this.container.cloneTo);
		this.menu.webcam.$elm = tabbar.createItem("webcam_link", "webcam", "tab").insertAfter(this.menu.webcam.cloneTo).find('a').text('Webcam');

		this.container.webcam.$container.next().appendTo(this.container.webcam.cloneTo);
		this.container.webcam.$container.prependTo(this.container.webcam.cloneTo);

		$('<!-- ko allowBindings: false -->').insertBefore(this.container.$elm);
		$('<!-- /ko -->').insertAfter(this.container.$elm);

		$("#webcam_container").attr("data-bind", $("#webcam_container").attr("data-bind").replace("keydown: onKeyDown, ", ""));
		$("#webcam_image").on("mousedown", function(e) {
			e.preventDefault();
		});
	}

}

TouchUI.prototype.DOM.move.afterTabAndNav = function() {

	this.DOM.create.dropdown.container.children().each(function(ind, elm) {
		var $elm = $(elm);
		$('<!-- ko allowBindings: false -->').insertBefore($elm);
		$('<!-- /ko -->').insertAfter($elm);
	});

	//Add hr before the settings icon
	$('<li class="divider"></li>').insertBefore("#navbar_settings");
	$('<li class="divider" id="divider_systemmenu" style="display: none;"></li>').insertBefore("#navbar_systemmenu").attr("data-bind", $("#navbar_systemmenu").attr("data-bind"));

	if ($("#touchui_text_nonlink_container").length > 0) {
		$('<li class="divider"></li>').insertBefore($("#touchui_text_nonlink_container").parent());
	}
}

TouchUI.prototype.DOM.move.connection = {
	$container: null,
	containerId: "connection_dialog",
	$cloneContainer: $("#usersettings_dialog"),
	$cloneModal: $("#connection_wrapper"),
	cloneTo: "#all_touchui_settings > ul",

	init: function( tabbar ) {
		var text = this.$cloneModal.find(".accordion-heading").text().trim();

		// Clone usersettings modal
		this.$container = this.$cloneContainer.clone().attr("id", this.containerId).insertAfter(this.$cloneContainer);
		this.$containerBody = this.$container.find(".modal-body");

		// Remove all html from clone
		this.$containerBody.html("");

		// Append tab contents to modal
		this.$cloneModal.appendTo(this.$containerBody);

		// Set modal header to accordion header
		this.$container.find(".modal-header h3").text(text);

		// Create a link in the dropdown
		this.$menuItem = tabbar.createItem("conn_link2", this.containerId, "modal", text)
			.attr("data-bind", "visible: loginState.isAdmin")
			.prependTo(this.cloneTo);
	}
}

TouchUI.prototype.DOM.move.controls = {

	init: function() {

		// backward compatibility with <1.3.0
		if($('#control-jog-feedrate').length === 0) {
			var jogPanels = $('#control > .jog-panel');

			$(jogPanels[0]).find(".jog-panel:nth-child(1)").attr("id", "control-jog-xy");
			$(jogPanels[0]).find(".jog-panel:nth-child(2)").attr("id", "control-jog-z");
			$(jogPanels[1]).attr("id", "control-jog-extrusion");
			$(jogPanels[2]).attr("id", "control-jog-general");

			$('<div class="jog-panel" id="control-jog-feedrate"></div>').insertAfter($(jogPanels[2]));
			$(jogPanels[0]).find("> button:last-child").prependTo("#control-jog-feedrate");
			$(jogPanels[0]).find("> input:last-child").prependTo("#control-jog-feedrate");
			$(jogPanels[0]).find("> .slider:last-child").prependTo("#control-jog-feedrate");

		}

		$("#control-jog-feedrate").attr("data-bind", $("#control-jog-extrusion").data("bind")).insertAfter("#control-jog-extrusion");
		$("#control-jog-extrusion button:last-child").prependTo("#control-jog-feedrate");
		$("#control-jog-extrusion input:last-child").prependTo("#control-jog-feedrate");
		$("#control-jog-extrusion .slider:last-child").prependTo("#control-jog-feedrate");

		$("#control div.distance").prependTo("#control-jog-feedrate");
		$("#control-jog-feedrate").insertBefore("#control-jog-extrusion");

	}

}

TouchUI.prototype.DOM.move.navbar = {
	mainItems: ['#all_touchui_settings', '#navbar_login', '.hidden_touch'],
	init: function() {

		var $items = $("#navbar ul.nav > li:not("+this.DOM.move.navbar.mainItems+")");
		var hasTextLinks = false;
		$($items.get().reverse()).each(function(ind, elm) {
			var $elm = $(elm);

			if($elm.children('a').length > 0) {
				var elme = $elm.children('a')[0];

				$elm.prependTo(this.DOM.create.dropdown.container);

				$.each(elme.childNodes, function(key, node) {
					if(node.nodeName === "#text") {
						node.nodeValue = node.nodeValue.trim();
					}
				});

				if(!$(elme).text()) {
					$(elme).text($(elme).attr("title"));
				}
			} else {
				if(!hasTextLinks) {
					hasTextLinks = true;
					$('<li><ul id="touchui_text_nonlink_container"></ul></li>').appendTo(this.DOM.create.dropdown.container);
				}

				$elm.appendTo("#touchui_text_nonlink_container");
			}
		}.bind(this));

		// Move TouchUI to main dropdown
		$("#navbar_plugin_touchui").insertAfter("#navbar_settings");

		// Create and Move login form to main dropdown
		$('<li><ul id="youcanhazlogin"></ul></li>').insertAfter("#navbar_plugin_touchui");
		
		$('#navbar_login')
			.appendTo('#youcanhazlogin')
			.find('a.dropdown-toggle')
			.text($('#youcanhazlogin').find('a.dropdown-toggle').text().trim())
			.attr("data-bind", "visible: !loginState.loggedIn()");

		// Create a fake dropdown link that will be overlapped by settings icon
		$('<li id="touchui_dropdown_link"><a href="#"></a></li>').appendTo("#tabs");
		
		// Create fake TouchUI tabbar and map it to the original dropdown
		function resizeMenuItem() {
			var width = $('#print_link').width();
			$('#all_touchui_settings').width(width);
			
			setTimeout(function() {
				var width = $('#print_link').width();
				$('#all_touchui_settings').width(width);
			}, 100);

			setTimeout(function() {
				var width = $('#print_link').width();
				$('#all_touchui_settings').width(width);
			}, 600);
		}
		$(window).on('resize.touchui.navbar', resizeMenuItem);
		resizeMenuItem();
		
		// Move the navbar temp plugin
		this.plugins.psuControl.call(this);
	}

}

TouchUI.prototype.DOM.move.overlays = {

	mainItems: ['#offline_overlay', '#reloadui_overlay', '#drop_overlay'],
	init: function() {

		$(this.DOM.move.overlays.mainItems).each(function(ind, elm) {
			var $elm = $(elm);
			$elm.appendTo('body');
		}.bind(this));

	}

}

TouchUI.prototype.DOM.move.tabbar = {
	init: function() {
		//var howManyToSplice = ($("#webcam_container").length > 0) ? 3 : 4;

		var $items = $("#tabs > li:not(#print_link, #touchui_dropdown_link, .hidden_touch)");
		$($items).each(function(ind, elm) {
			var $elm = $(elm);

			// Clone the items into the dropdown, and make it click the orginal link
			$elm
				.clone()
				.attr("id", $elm.attr("id")+"2")
				.prependTo("#all_touchui_settings > .dropdown-menu")
				.find("a")
				.off("click")
				.on("click", function(e) {
					$elm.find('a').click();
					$("#all_touchui_settings").addClass("item_active");
					e.preventDefault();
					return false;
				});

			$elm.addClass("hidden_touch");
		}.bind(this));

		$items = $("#tabs > li > a");
		$items.each(function(ind, elm) {
			$(elm).text("");
		}.bind(this));
		
		var resize = function() {
			var width = $('#print_link').width();
			var winWidth = $(window).width();
			var items = $('#tabs > li');
			var itemsFit = Math.ceil(winWidth / width) - 3;

			if (winWidth > (width * 2)) {
				items.each(function(key, elm) {
					if (key > itemsFit) {
						$(elm).addClass('hidden_touch');
						$('#' + $(elm).attr('id') + '2').removeClass('hidden_touch');
					} else {
						$(elm).removeClass('hidden_touch');
						$('#' + $(elm).attr('id') + '2').addClass('hidden_touch');
					}
				});
			}
		}

		$(window).on('resize.touchui.tabbar', resize);
		$(window).on('resize.touchui.tabbar', _.debounce(resize, 200));
		$(window).on('resize.touchui.tabbar', _.debounce(resize, 600));
		resize();

	}
}

TouchUI.prototype.DOM.move.terminal = {

	init: function() {

		// Add version number placeholder
		$('<span></span>').prependTo("#terminal-output");

		// Create iScroll container for terminal
		var container = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
		var inner = $('<div id="terminal-scroll-inner"></div>').appendTo(container);
		$("#terminal-output").appendTo(inner);
		$("#terminal-output-lowfi").appendTo(inner);

	}

};

TouchUI.prototype.DOM.overwrite.modal = function() {

	//We need a reliable event for catching new modals for attaching a scrolling bar
	$.fn.modalBup = $.fn.modal;
	$.fn.modal = function(options, args) {
		// Update any other modifications made by others (i.e. OctoPrint itself)
		$.fn.modalBup.defaults = $.fn.modal.defaults;

		// Create modal, store into variable so we can trigger an event first before return
		var tmp = $(this).modalBup(options, args);
		if (options !== "hide") {
			$(this).trigger("modal.touchui", this);
		}
		return tmp;
	};
	$.fn.modal.prototype = { constructor: $.fn.modal };
	$.fn.modal.Constructor = $.fn.modal;
	$.fn.modal.defaults = $.fn.modalBup.defaults;

}

TouchUI.prototype.DOM.overwrite.pnotify = function() {

	if(!this.settings.hasTouch) {
		var tmp = PNotify.prototype.options.stack;
		tmp.context = $('#scroll .page-container');
		PNotify.prototype.options.stack = tmp;
	}

}

TouchUI.prototype.DOM.overwrite.tabbar = function() {

	// Force the webcam tab to load the webcam feed that original is located on the controls tab
	$('#tabs [data-toggle=tab]').each(function(ind, elm) {

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

TouchUI.prototype.DOM.overwrite.tabdrop = function() {
	$.fn.tabdrop = function() {};
	$.fn.tabdrop.prototype = { constructor: $.fn.tabdrop };
	$.fn.tabdrop.Constructor = $.fn.tabdrop;
}
