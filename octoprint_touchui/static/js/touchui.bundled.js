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

		isFullscreen: ko.observable(false),
		isTouchscreen: ko.observable(false),

		isEpiphanyOrKweb: (window.navigator.userAgent.indexOf("AppleWebKit") !== -1 && window.navigator.userAgent.indexOf("ARM Mac OS X") !== -1),
		isChromiumArm: (window.navigator.userAgent.indexOf("X11") !== -1 && window.navigator.userAgent.indexOf("Chromium") !== -1 && window.navigator.userAgent.indexOf("armv7l") !== -1 || window.navigator.userAgent.indexOf("TouchUI") !== -1),

		hasFullscreen: ko.observable(document.webkitCancelFullScreen || document.msCancelFullScreen || document.oCancelFullScreen || document.mozCancelFullScreen || document.cancelFullScreen),
		hasLocalStorage: ('localStorage' in window),
		hasTouch: ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0),

		canLoadAutomatically: ($("#loadsomethingsomethingdarkside").length > 0),
		touchuiModal: $('#touchui_settings_dialog'),

		isKeyboardActive: ko.observable(false),
		isHidebarActive: ko.observable(false),

		whatsNew: ko.observable(false)
	},

	core: {},
	knockout: {},
	plugins: {},
	animate: {},
	DOM: {
		create: {},
		move: {},
		overwrite: {}
	},
	components: {
		material: {}
	},
	scroll: {

		defaults: {
			iScroll: {
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

TouchUI.prototype.components.dropdown = {

	init: function() {
		this.components.dropdown.toggleSubmenu.call( this );
		this.components.dropdown.toggle.call( this );
	},

	// Rewrite opening of dropdowns
	toggle: function() {
		var self = this;
		var $document = $(document);

		// Triggered when we create the dropdown and need scrolling
		$document.on("dropdown-open.touchui", function(e, elm, $toggle) {
			var $elm = $(elm);
			var div;

			// Animate height with CSS transition
			var $height = $elm.innerHeight();
			$(div).height($height - ($height * 0.7));
			$(div).height($height);

			if (!self.settings.hasTouch) {

				if (!$toggle.data("iscroll")) {

					div = $('<div/>').addClass("dropdown-menu").insertAfter(elm)[0];
					$elm.appendTo(div).removeClass("dropdown-menu");

					// Create dropdown scroll
					self.scroll.modal.dropdown = new IScroll(div, $.extend({ fadeScrollbars: false }, self.scroll.defaults.iScroll));

					// Store bindings into variable for future reference
					var scrollStart = self.scroll.blockEvents.scrollStart.bind(self, $elm, self.scroll.modal.dropdown),
						scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self, $elm, self.scroll.modal.dropdown);

					// Disable all JS events for smooth scrolling
					self.scroll.modal.dropdown.on("scrollStart", scrollStart);
					self.scroll.modal.dropdown.on("scrollEnd", scrollEnd);
					self.scroll.modal.dropdown.on("scrollCancel", scrollEnd);

					$toggle.data("iscroll", self.scroll.modal.dropdown);

				} else {

					div = elm;
					self.scroll.modal.dropdown = $toggle.data("iscroll");

				}

				setTimeout(function() {
					if (self.scroll.modal.dropdown) {
						self.scroll.refresh(self.scroll.modal.dropdown);
					}
				}, 0);
				setTimeout(function() {
					if (self.scroll.modal.dropdown) {
						self.scroll.refresh(self.scroll.modal.dropdown);
					}
				}, 180);

				// Set scroll to active item
				//self.scroll.modal.dropdown.scrollToElement($elm.find('li.active')[0], 0, 0, -30);

				// Disable scrolling in active modal
				if (!$(div).parents('#all_touchui_settings').length) {
					self.scroll.currentActive.disable();
					self.scroll.iScrolls.terminal.disable();
				}

				$document.on("dropdown-closed.touchui", function(eve) {
					self.scroll.refresh(self.scroll.currentActive);
					self.scroll.iScrolls.terminal.enable();

					if (!$toggle.parents("#all_touchui_settings").length) {
						// Enable active modal
						self.scroll.currentActive.enable();
						$document.off(eve);

						if (self.scroll.modal.dropdown) {
							self.scroll.modal.dropdown = null;
						}
					}

				});
			}
		});
	},

	// Support 1.3.0 onMouseOver dropdowns
	toggleSubmenu: function() {
		$(".dropdown-submenu").addClass("dropdown");
		$(".dropdown-submenu > a").attr("data-toggle", "dropdown");
	},

	// Refresh current scroll and add a min-height so we can reach the dropdown if needed
	// containerMinHeight: function($dropdownContainer, $dropdownToggle) {
	// 	var self = this;
	//
	// 	// Touch devices can reach the dropdown by CSS, only if we're using iScroll
	// 	if ( !self.settings.hasTouch ) {
	// 		// Get active container
	// 		var $container = ($dropdownContainer.parents('.modal').length === 0 ) ? $('.octoprint-container') : $dropdownContainer.parents('.modal .modal-body');
	//
	// 		// If we toggle within the dropdown then get the parent dropdown for total height
	// 		var $dropdownMenu = ( $dropdownContainer.parents('.open > .dropdown-menu').length > 0 ) ? $dropdownContainer.parents('.open > .dropdown-menu') : $dropdownToggle.next();
	//
	// 		setTimeout(function() {
	//
	// 			//If the main dropdown has closed (by toggle) then let's remove the min-height else
	// 			if(!$dropdownMenu.parent().hasClass("open")) {
	// 				$container.css("min-height", 0);
	// 				self.scroll.currentActive.refresh();
	// 			} else {
	// 				var y = Math.abs(self.scroll.currentActive.y),
	// 					height = $dropdownMenu.outerHeight(),
	// 					top = $dropdownMenu.offset().top;
	//
	// 				$container.css("min-height", y + top + height);
	// 				self.scroll.currentActive.refresh();
	// 			}
	//
	// 		}, 0);
	// 	}
	// }

}

TouchUI.prototype.components.fullscreen = {
	init: function() {
		var self = this;

		// Bind fullscreenChange to knockout
		$(document).bind("fullscreenchange", function() {
			self.settings.isFullscreen($(document).fullScreen() !== false);
			self.DOM.storage.set("fullscreen", self.settings.isFullscreen());
		});

	},
	ask: function() {
		var self = this;

		if(self.settings.hasFullscreen()) {

			new PNotify({
				title: 'Fullscreen',
				text: 'Would you like to go fullscreen?',
				icon: 'glyphicon glyphicon-question-sign',
				type: 'info',
				hide: false,
				addclass: 'askFullscreen',
				confirm: {
					confirm: true,
					buttons: [{
						text: 'Yes',
						addClass: 'btn-primary',
						click: function(notice) {
							notice.remove();
							$(document).fullScreen(true);
						}
					}, {
						text: 'No',
						click: function(notice) {
							notice.remove();
							$(document).trigger("fullscreenchange");
						}
					}]
				},
				buttons: {
					closer: false,
					sticker: false
				},
				history: {
					history: false
				}
			});
		}

	}
}

TouchUI.prototype.components.keyboard = {

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

		var notThis = ['[type="file"]','[type="checkbox"]','[type="radio"]','.select-dropdown'];
		$(document).on("focus", 'input:not('+notThis+'), textarea', function(e) {
			var $elm = $(e.target);

			if($elm.parents('.octoprint-container').length) {

				if(!self.settings.isKeyboardActive()) {

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
			}

		});
	},

	onShow: function(event, keyboard, el) {
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
			this.components.modal.dropdown.create.call(this, "#settings_dialog_menu ul.nav", "special-dropdown-uni", "#settings_dialog_label");
		}
		if($("#usersettings_dialog ul.nav").length > 0) {
			this.components.modal.dropdown.create.call(this, "#usersettings_dialog ul.nav", "special-dropdown-uni-2", "#usersettings_dialog h3");
		}
	},

	dropdown: {
		create: function(cloneId, newId, appendTo) {
			var self = this;
			var $appendTo = $(appendTo);
			var $cloneId = $(cloneId);

			$appendTo
				.text($appendTo.text().replace("OctoPrint", "").trim())

			var $div = $('<div/>')
				.addClass('dropdown')
				.appendTo($appendTo);

			$cloneId
				.attr("id", newId)
				.addClass('dropdown-menu')
				.appendTo($div);

			// Create a label that is clickable
			var $settingsLabel = $('<a class="dropdown-toggle" href="#" data-toggle="dropdown"></a>')
				.insertBefore($cloneId)
				.text($("#"+newId+" .active").text().trim());

		}
	}
}

TouchUI.prototype.components.touchList = {
	init: function() {
		var self = this;

		$('#files').hammerPan({
			container: {
				size: $(window).width(),
			},
			block: $('.tabbable > .tab-content'),
			target: ['target', '.entry'],
			width: 70,
			reverse: true,
			onStep: function(pos, elm) {
				var translate = 'translate3d(' + pos + 'px, 0, 0)';

				$(elm).css({
					transform: translate,
					mozTransform: translate,
					webkitTransform: translate
				});
			}
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

TouchUI.prototype.core.boot = function() {

	// This should always start TouchUI
	if(
		document.location.hash === "#touch" ||
		document.location.href.indexOf("?touch") > 0 ||
		this.DOM.storage.get("active")
	) {

		return true;

	} else if(
		this.settings.canLoadAutomatically &&
		this.DOM.storage.get("active") !== false
	) {

		if($(window).width() < 980 || this.settings.hasTouch) {
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
			"loginStateViewModel",
			"printerStateViewModel"
		],
		TOUCHUI_ELEMENTS: [
			"#touchui_settings_dialog",
			"#settings_plugin_touchui",
			"#navbar_plugin_touchui"
		],

		domLoading: function() {
			if (self.isActive()) {
				self.DOM.init.call(self);

				$.fn.slider = function() { return this; }
				$.fn.slider.on = _.noop;
				$.fn.slimScroll = _.noop;
			}
		},

		domReady: function() {
			if (self.isActive()) {
				if($("#gcode").length) {
					self.core.bridge.TOUCHUI_REQUIRED_VIEWMODELS = self.core.bridge.TOUCHUI_REQUIRED_VIEWMODELS.concat(["gcodeViewModel"]);
				}

				self.components.dropdown.init.call(self);
				self.components.fullscreen.init.call(self);
				self.components.keyboard.init.call(self);
				self.components.modal.init.call(self);
				self.components.touchList.init.call(self);

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
			importUrl:	"/plugin/touchui/static/less/touchui.bundled.less",
			import:		'@import "{importUrl}"; \n',
			variables:	"@main-color: {mainColor}; \n" +
						"@terminal-color: {termColor}; \n" +
						"@text-color: {textColor}; \n" +
						"@main-background: {bgColor}; \n\n"
		},
		API: "/plugin/touchui/css"
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

					$.post(self.core.less.options.API, {
							css: result.css
						})
						.done(function() {
							if (self.settings.requireNewCSS()) {
								self.settings.refreshCSS("fast");
							}
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
		var content = error.responseText || error.message;
		if(content && content.trim() && error.status !== 401) {
			new PNotify({
				title: 'TouchUI: Whoops, something went wrong...',
				text: content,
				icon: 'glyphicon glyphicon-question-sign',
				type: 'error',
				hide: false
			});
		}

		console.error(error);

	}

}

TouchUI.prototype.core.version = {

	init: function(softwareUpdateViewModel) {
		var self = this;

		$("<span></span>").appendTo("#terminal-output");

		if(softwareUpdateViewModel) {

			softwareUpdateViewModel.versions.items.subscribe(function(changes) {

				touchui = softwareUpdateViewModel.versions.getItem(function(elm) {
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
			if (!this.settings.hasTouch) {
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
		if ((this.settings.isEpiphanyOrKweb || this.settings.isChromiumArm && this.DOM.storage.get("touchscreenActive") === undefined) || this.DOM.storage.get("touchscreenActive")) {
			this.components.touchscreen.init.call(this);
		}

		// Create fullscreen cookie if not existing and trigger pNotification
		if (this.DOM.storage.get("fullscreen") === undefined) {
			this.DOM.storage.set("fullscreen", false);
			this.components.fullscreen.ask.call(this);
		} else {
			//Cookie say user wants fullscreen, ask it!
			if(this.DOM.storage.get("fullscreen")) {
				this.components.fullscreen.ask.call(this);
			}
		}

		// Get state of cookies and store them in KO
		this.settings.isKeyboardActive(this.DOM.storage.get("keyboardActive"));
		this.settings.isHidebarActive(this.DOM.storage.get("hideNavbarActive"));
		this.settings.isFullscreen(this.DOM.storage.get("fullscreen"));

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

TouchUI.prototype.DOM.pool = {
	timer: null,
	callTree: [],
	duration: 100,

	// For performance we will add some heavy functions into a que
	// We will execute them later and not during this runtime (i.e. iScroll refresh after DOMloading)
	add: function(fn, scope) {
		if(!this.timer) {
			this.timer = setTimeout(this.execute.bind(this), this.duration);
		}

		this.callTree.push([fn, scope]);
	},

	execute: function() {
		_.each(this.callTree, function(fn) {
			fn[0].call(fn[1]);
		});

		this.callTree = [];
		this.timer = null;
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

TouchUI.prototype.DOM.init = function() {

	// Create new tab with files, dashboard and temperature and make it active
	this.DOM.create.files.init.call(this, this.DOM.create.tabbar);
	this.DOM.create.dashboard.init(this.DOM.create.tabbar);
	this.DOM.create.temperature.init.call(this);

	// Create a new persistent dropdown
	this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

	// Move connection sidebar into a new modal
	this.DOM.move.connection.init(this.DOM.create.tabbar);

	// Manipulate controls div
	this.DOM.move.controls.init();

	// Disable these bootstrap/jquery plugins
	this.DOM.overwrite.tabdrop.call(self);
	this.DOM.overwrite.modal.call(self);

	// Add a webcam tab if it's defined
	if ($("#webcam_container").length > 0) {
		this.DOM.create.webcam.init(this.DOM.create.tabbar);
	}

	// Move all other items from tabbar into dropdown
	this.DOM.move.navbar.init.call(this);
	this.DOM.move.overlays.init.call(this);
	this.DOM.move.terminal.init.call(this);

	this.components.material.ripple();
	// $('.dropdown-toggle').each(function(ind, elm) {
	// 	var $elm = $(elm);
	// 	var _id = _.uniqueId("dropdown");
	//
	// 	if(!$elm.parents('#all_touchui_settings').length) {
	//
	// 		$elm.removeClass('dropdown-toggle')
	// 			.attr('data-toggle', null)
	// 			.addClass('dropdown-button')
	// 			.attr('data-activates', _id);
	//
	// 		$elm.next()
	// 			.removeClass('dropdown-menu')
	// 			.addClass('dropdown-content')
	// 			.attr('id', _id);
	//
	// 	}
	// });

	var div = $('<div class="input-field"></div>').appendTo('body');
	var $elems = $('input, textarea, select');
	$elems.each(function moveInputs(ind, elm) {
		var $elm = $(elm);
		var id = $elm.attr("id");
		var $for = (id) ? $('label[for="' + id + '"]') : [];
		//var isControlLabel = $elm.parents('.controls').prev().hasClass('control-label');

		if ($for.length) {

			var $div = div.clone();

			if ($elm.is('select, textarea, input:not([type="radio"]):not([type="checkbox"])')) {
				$div.addClass('withLabel');
			}

			$div.insertAfter($elm);
			$elm.appendTo($div);
			$for.prependTo($div);

		} /*else if ($elm.parent().hasClass("checkbox") || $elm.parent().hasClass("radio") || isControlLabel) {

			var $parent = (isControlLabel) ? $elm.parents('.controls').prev() : $elm.parent();
			var _id = _.uniqueId("input");

			$div = $(div).insertAfter((isControlLabel) ? $elm : $parent);
			$elm.appendTo($div).attr("id", _id);
			$parent.appendTo($div).attr("for", _id);

		}*/

		if ($elm.prop('tagName').toLowerCase() === 'textarea') {
			$elm.addClass('materialize-textarea');
		}

	});

	// $('select').each(function(ind, elm) {
	// 	var $elm = $(elm);
	// 	$elm.attr("data-bind", $elm.attr("data-bind") + ', materialSelect: true');
	// });
	//
	// ko.bindingHandlers.materialSelect = {
	// 	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
	// 		allBindings();
	// 		$(element).material_select();
	// 	},
	// 	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
	// 		allBindings();
	// 		$(element).material_select();
	// 	}
	// };

	// Create headers
	this.DOM.create.headers.init.call(this);

	// Remove active class when clicking on a tab in the tabbar
	$('#tabs [data-toggle=tab]').on("click", function() {
		$("#all_touchui_settings").removeClass("item_active");
	});

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
				self.settings.isKeyboardActive(self.DOM.storage.toggleBoolean("keyboardActive"));
			}
		},

		toggleHidebar: function() {
			if (self.isActive()) {
				self.settings.isHidebarActive(self.DOM.storage.toggleBoolean("hideNavbarActive"));
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

		self.components.material.sidenav.call(self);
		self.components.touchscreen.isLoading.call(self, viewModels);

		$("#tabs").appendTo("#navbar");

		// Prevent user from double clicking in a short period on buttons
		// $(document).on("click", "button:not(.box, .distance, .dropdown-toggle)", function(e) {
		// 	var printer = $(e.target);
		// 	printer.prop('disabled', true);
		//
		// 	setTimeout(function() {
		// 		printer.prop('disabled', false);
		// 	}, 600);
		// });

		viewModels.temperatureViewModel.heaterOptions.subscribe(function(heaterOptions) {
			var tmp;

			_.each(_.keys(heaterOptions), function(type) {
				if (
					heaterOptions[type].color !== $('#navbar').css("background-color") &&
					heaterOptions[type].color !== $('.bar').css("background-color")
				) {
					tmp = true;
					if (heaterOptions[type].name === "Bed") {
						heaterOptions[type].color = $('.bar').css("background-color");
					} else {
						heaterOptions[type].color = $('#navbar').css("background-color");
					}
				}
			});

			if (tmp) {
				viewModels.temperatureViewModel.heaterOptions(heaterOptions);
			}
		});

		// Update scroll area if new items arrived
		if( !self.settings.hasTouch ) {
			viewModels.gcodeFilesViewModel.listHelper.paginatedItems.subscribe(function(a) {
				setTimeout(function() {
					self.scroll.refresh(self.scroll.iScrolls.body);
				}, 300);
			});
		}

		// Watch the operational binder for visual online/offline
		viewModels.connectionViewModel.isOperational.subscribe(function(newOperationalState) {
			var printLink = $("#all_touchui_settings");
			if( !newOperationalState ) {
				printLink.addClass("offline").removeClass("online");
				$("#conn_link_mirror").addClass("offline").removeClass("online");
			} else {
				printLink.removeClass("offline").addClass("online");
				$("#conn_link_mirror").removeClass("offline").addClass("online");
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

TouchUI.prototype.knockout.viewModel = function() {
	var self = this;

	// Subscribe to OctoPrint events
	self.onStartupComplete = function () {
		self.knockout.isReady.call(self, self.core.bridge.allViewModels);
		if (self.isActive()) {
			self.DOM.overwrite.tabbar.call(self);
			self.plugins.init.call(self, self.core.bridge.allViewModels);
		};
	}

	self.onBeforeBinding = function() {
		ko.mapping.fromJS(self.core.bridge.allViewModels.settingsViewModel.settings.plugins.touchui, {}, self.settings);
	}

	self.onSettingsBeforeSave = function() {
		self.core.less.save.call(self);
	}

	self.onTabChange = function() {
		if (self.isActive()) {
			$('#fab').removeClass('show');
			self.DOM.pool.add(function() {

				if(!self.settings.hasTouch && self.scroll.currentActive) {
					self.scroll.refresh(self.scroll.currentActive);
					setTimeout(function() {
						self.scroll.refresh(self.scroll.currentActive);
					}, 10);
				}
			});
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

TouchUI.prototype.scroll.blockEvents = {
	className: "no-pointer",

	scrollStart: function($elm, iScrollInstance) {
		$elm.addClass(this.scroll.blockEvents.className);
	},

	scrollEnd: function($elm, iScrollInstance) {
		$elm.removeClass(this.scroll.blockEvents.className);
		this.scroll.refresh(iScrollInstance);
	}

}

TouchUI.prototype.scroll.body = {

	init: function() {
		var self = this;
		var scrollStart = false;
		var tmp = [];

		// Create main body scroll
		self.scroll.iScrolls.body = new IScroll(".octoprint-container", self.scroll.defaults.iScroll);
		if ($("#all_touchui_settings .dropdown-menu").length > 0) {
			self.scroll.iScrolls.menu = new IScroll("#all_touchui_settings .dropdown-menu", self.scroll.defaults.iScroll);
			tmp.push(self.scroll.iScrolls.menu);
		}
		self.scroll.currentActive = self.scroll.iScrolls.body;

		_.each([self.scroll.iScrolls.body].concat(tmp), function(iScroll) {
			var $noPointer = $(iScroll.wrapper);

			// Block everthing while scrolling
			var scrollStart = self.scroll.blockEvents.scrollStart.bind(self, $noPointer, iScroll),
				scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self, $noPointer, iScroll);

			// Disable all JS events while scrolling for best performance
			iScroll.on("scrollStart", scrollStart);
			iScroll.on("onBeforeScrollStart", scrollStart);
			iScroll.on("scrollEnd", scrollEnd);
			iScroll.on("scrollCancel", scrollEnd);

		});

		// Prevent any misfortune
		$(document).on("mouseup.prevent.pointer touchend.prevent.pointer", function() {
			$('.no-pointer').removeClass('no-pointer');
		});

	}

}

TouchUI.prototype.scroll.modal = {
	stack: [],
	dropdown: null,

	init: function() {
		var $document = $(document),
			self = this;


		// $document.on("modal.touchui", function(e, elm) {
		// 	var $modalElm = $(elm),
		// 		$modalContainer = $(elm).parent();
		//
		// 	// Create temp iScroll within the modal
		// 	var curModal = new IScroll($modalContainer[0], self.scroll.defaults.iScroll);
		//
		// 	// Store into stack
		// 	self.scroll.modal.stack.push(curModal);
		// 	self.scroll.currentActive = curModal;
		//
		// 	// Force iScroll to get the correct scrollHeight
		// 	setTimeout(function() {
		// 		if(curModal) {
		// 			curModal.refresh();
		// 		}
		// 	}, 0);
		// 	// And Refresh again after animation
		// 	setTimeout(function() {
		// 		if(curModal) {
		// 			curModal.refresh();
		// 		}
		// 	}, 800);
		//
		// 	// Store bindings into variable for future reference
		// 	var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $modalElm, curModal),
		// 		scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $modalElm, curModal);
		//
		// 	// Disable all JS events while scrolling for best performance
		// 	curModal.on("scrollStart", scrollStart);
		// 	curModal.on("scrollEnd", scrollEnd);
		// 	curModal.on("scrollCancel", scrollEnd);
		//
		// 	// Refresh the scrollHeight and scroll back to top with these actions:
		// 	$document.on("click.scrollHeightTouchUI", '[data-toggle="tab"], .pagination ul li a', function(e) {
		// 		curModal._end(e);
		//
		// 		setTimeout(function() {
		// 			curModal.refresh();
		// 			curModal.scrollTo(0, 0);
		// 		}, 0);
		// 	});
		//
		// 	// Kill it with fire!
		// 	$modalElm.one("destroy", function() {
		// 		$document.off("click.scrollHeightTouchUI");
		// 		self.scroll.modal.stack.pop();
		//
		// 		if(self.scroll.modal.stack.length > 0) {
		// 			self.scroll.currentActive = self.scroll.modal.stack[self.scroll.modal.stack.length-1];
		// 		} else {
		// 			self.scroll.currentActive = self.scroll.iScrolls.body;
		// 		}
		//
		// 		curModal.destroy();
		// 		curModal.off("scrollStart", scrollStart);
		// 		curModal.off("scrollEnd", scrollEnd);
		// 		curModal.off("scrollCancel", scrollEnd);
		// 		curModal = undefined;
		// 	});
		//
		// });


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
				self.scroll.refresh(self.scroll.iScrolls.overlay[ind]);
			});
		}, 0);

	}

}

TouchUI.prototype.scroll.overwrite = function(terminalViewModel) {
	var self = this;

	if ( !this.settings.hasTouch ) {

		// Enforce no scroll jumping
		$(".octoprint-container").on("scroll", function(e) {
			if($(e.target).scrollLeft() !== 0) {
				$(e.target).scrollLeft(0);
			}
		});

		// Overwrite scrollToEnd function with iScroll functions
		terminalViewModel.scrollToEnd = function() {
			if ($('#term.active').length) {
				self.scroll.refresh(self.scroll.iScrolls.terminal);
				self.scroll.iScrolls.terminal.scrollTo(0, self.scroll.iScrolls.terminal.maxScrollY);
			}
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
			if ($('#term.active').length) {
				var $container = $("#terminal-scroll");
				if ($container.length) {
					$container.scrollTop($container[0].scrollHeight - $container.height())
				}
			}
		}

	}

	// Resize height of low-fi terminal to enable scrolling
	terminalViewModel.plainLogOutput.subscribe(function() {
		if ($('#term.active').length && terminalViewModel.autoscrollEnabled()) {
			terminalViewModel.scrollToEnd();
		}
	});

	// Refresh terminal scroll height
	terminalViewModel.displayedLines.subscribe(function() {
		if ($('#term.active').length && terminalViewModel.autoscrollEnabled()) {
			terminalViewModel.scrollToEnd();
		}
	});

	// Redo scroll-to-end interface
	$("#term .terminal small.pull-right").html('<a href="#"><i class="fa fa-angle-double-down"></i></a>').on("click", function() {
		terminalViewModel.scrollToEnd();
		return false;
	});
}

TouchUI.prototype.scroll.refresh = function(iScrollInstance) {

	// Refresh the scrollview, but for performance..
	// we first check if it's needed at all
	if(iScrollInstance) {
		if(iScrollInstance.scrollerHeight !== $(iScrollInstance.scroller).innerHeight()) {
			iScrollInstance.refresh();
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
			self.scroll.refresh(self.scroll.iScrolls.terminal);

			if(this.hasVerticalScroll) {
				self.scroll.iScrolls.body.disable();
			}
		});
		self.scroll.iScrolls.terminal.on("scrollEnd", function() {
			self.scroll.iScrolls.body.enable();
		});

	}
}

TouchUI.prototype.scroll.touchscreen = {

	init: function() {
		var self = this;
		// Create main body scroll
		self.scroll.iScrolls.touchscreen = new IScroll("#touchui-overlay-animation", self.scroll.defaults.iScroll);

	}

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

	if ( !this.settings.hasTouch ) {

		// Set overflow hidden for best performance
		$("html").addClass("emulateTouch");

		self.DOM.pool.add(function() {
			self.scroll.terminal.init.call(self);
			self.scroll.body.init.call(self);
			self.scroll.modal.init.call(self);
			self.scroll.overlay.init.call(self);
		});

		$(document).on("slideCompleted", function() {
			self.scroll.refresh(self.scroll.currentActive);
		});

		// Refresh body on dropdown click
		$(document).on("click", ".pagination ul li a", function() {
			setTimeout(function() {
				self.scroll.refresh(self.scroll.currentActive);
			}, 0);
		});

	}

}

TouchUI.prototype.plugins.navbarTemp = function() {

	// Manually move navbar temp (hard move)
	if( $("#navbar_plugin_navbartemp").length > 0 ) {
		var navBarTmp = $("#navbar_plugin_navbartemp").appendTo(this.DOM.create.dropdown.container);
		$('<li class="divider"></li>').insertBefore(navBarTmp);
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

TouchUI.prototype.plugins.init = function (viewModels) {
	this.plugins.screenSquish(viewModels.pluginManagerViewModel);
}

TouchUI.prototype.components.material.ripple = function() {

	$('<div id="navbar-waves"></div>').on("click", function(e) {
		$('#all_touchui_settings > a').click();
	}).appendTo('#navbar .navbar-inner .container');

	var $ripple = $('button, a.btn, .nav li:not(#all_touchui_settings) a, #navbar-waves');
	$ripple.each(function touchUiRippleManipulate(ind, elm) {
		var $elm = $(elm);
		var html = $elm.html().trim();

		if (html && html.indexOf("</") === -1) {
			$elm.empty();
			$('<span/>').text(html).appendTo($elm);
		}

		$elm.addClass("waves-effect")
			.on("click", function(e) {
				var $target = $(e.target);
				if (
					$target.parents('#navbar').length &&
					!$target.parents('#all_touchui_settings').length &&
					$target.attr("id") !== "navbar-waves" ||
					$target.parents('.tabs-mirror').length
				) {
					$('.is-active').removeClass('is-active');
					setTimeout(function() {
						$elm.addClass('is-active');
					}, 200);
				}
			});

	});
/*
	$('.brand').click(function(e) {
		e.preventDefault();
		var navbar = $('#navbar-waves')[0];

		var mousedown = new MouseEvent("mousedown", e.originalEvent);
		var mouseup = new MouseEvent("mouseup", e.originalEvent);
		var click = new MouseEvent("click", e.originalEvent);

		navbar.dispatchEvent(mousedown);
		setTimeout(function() {
			navbar.dispatchEvent(mouseup);
			$('#navbar-waves').click();
		}, 0);
	});

	$('#all_touchui_settings > a').on('mousedown touchstart', function(e) {
		e.stopPropagation();
		e.preventDefault();

		var navbar = $('#navbar-waves')[0];
		e.originalEvent.target = navbar;

		var mousedown = new MouseEvent("mousedown", e.originalEvent);
		var mouseup = new MouseEvent("mouseup", e.originalEvent);
		var click = new MouseEvent("click", e.originalEvent);

		navbar.dispatchEvent(mousedown);
		setTimeout(function() {
			navbar.dispatchEvent(mouseup);
			$('#navbar-waves').click();
		}, 0);

		return false;
	});*/
}

TouchUI.prototype.components.material.sidenav = function() {
	var self = this;

	$('.tabbable > .tab-content').hammerPan({
		container: {
			size: $(window).width(),
		},
		target: $('#navbar'),
		block: $('#files'),
		width: 70,

		onStep: function(pos, elm, ev) {
			$(elm).removeClass('animate').css('min-width', pos);

			if (self.settings.hasTouch) {
				$('.octoprint-container').removeClass('animate').css('padding-left', pos);
			}

			if (ev.type == 'panend' || ev.type == 'pancancel') {
				$(elm).addClass('animate');
				if (self.settings.hasTouch) {
					$('.octoprint-container').addClass('animate');
				}
			}
		},

		onTap: function(pos, elm) {
			$(elm).addClass('animate')
				.data("panStart", 0)
				.css({
					'min-width': 0
				});

			if (self.settings.hasTouch) {
				$('.octoprint-container').addClass('animate').css('padding-left', 0);
			}
		}

	});

}

TouchUI.prototype.DOM.create.dashboard = {

	container: {
		cloneTo: "#temp"
	},

	move: {
		$state: $("#state_wrapper")
	},

	init: function( tabbar ) {

		// Create dashboard
		var $dashboard = $('<div id="dashboard" class="tab-pane active"><div class="inner"></div></div>')
			.insertBefore(this.container.cloneTo);

		this.move.$state
			.appendTo($dashboard.find('.inner'));

		$dashboard.find(".accordion-toggle")
			.attr("data-bind", "text: appearance.name() == '' ? appearance.title : appearance.name");

		$(this.container.cloneTo)
			.appendTo($dashboard.find('.inner'))
			.attr("class", "");

		$("#temp_link a")
			.attr("href", "#dashboard")
			.addClass("is-active");

		var $wrapper = $("#state_wrapper .accordion-heading").prependTo($dashboard);
		$("#job_cancel").html('<i class="icon-stop"></i>');
		$wrapper.find('a').text("");
		$('.print-control').appendTo($wrapper);

		$("#temperature-graph").appendTo($dashboard);

	}

}

TouchUI.prototype.DOM.create.dropdown = {

	menuItem: {
		cloneTo: $('#navbar ul.nav')
	},
	container: null,

	init: function() {

		this.menuItem.menu = $('<!-- ko allowBindings: false -->' +
			'<li id="all_touchui_settings" class="dropdown">' +
				'<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
					$('navbar_show_settings').text() +
				'</a>' +
			'</li>' +
			'<!-- /ko -->').prependTo(this.menuItem.cloneTo);

		this.container = $('<div class="dropdown-menu"></div>').appendTo(this.menuItem.menu);
		this.container = $('<ul></ul>').appendTo(this.container);
	}

}

TouchUI.prototype.DOM.create.files = {

	menu: {
		cloneTo: "#temp_link"
	},

	container: {
		cloneTo: "#temp"
	},

	move: {
		$files: $("#files_wrapper")
	},

	init: function( tabbar ) {
		var self = this;

		// Create navbar item
		this.DOM.create.files.menu.$elm = tabbar.createItem("files_link", "files", "tab")
			.insertAfter(this.DOM.create.files.menu.cloneTo);

		// Hijack files id :)
		$('#files').attr('id', 'files-inner');

		// Create main container
		this.DOM.create.files.container.$elm = $('<div id="files" class="tab-pane"><div class="row-fluid"></div></div>')
			.insertBefore(this.DOM.create.files.container.cloneTo);

		// Move the contents of the hidden accordions to the new print status and files tab
		this.DOM.create.files.move.$files.appendTo("#files .row-fluid");

		$('<div class="switch-view"><a href="#"><span class="icon-wrench"/></a></div>').insertAfter('.sd-trigger')
			.find('a')
			.on("click", function(e) {
				e.preventDefault();
				self.DOM.create.files.container.$elm.toggleClass("condensed");

				if (!self.settings.hasTouch) {
					setTimeout(self.scroll.currentActive.refresh.bind(self.scroll.currentActive), 400);
				}
			});

		// Create FAB
		this.DOM.create.files.FAB();
	},

	FAB: function() {

		// Create FAB
		var $fab = $('<div/>').attr("class", "fab")
			.attr("id", "fab");

		// Toggle
		var $fabLink = $('<a href="#" class="toggle"></a>').appendTo($fab)
			.on("click", function(e) {
				e.preventDefault();
				$fab.toggleClass('active');
			});

		// Move buttons
		var $fabInner = $('.upload-buttons').attr("class", "fab-inner")
			.appendTo($fab);

		// Move Refresh
		$('.refresh-trigger').addClass('btn')
			.appendTo($fabInner);

		// Move progressbar
		$('#gcode_upload_progress').appendTo($fabLink);

		// Add to DOM
		$fab.appendTo('.octoprint-container');

		// Show FAB if tab is active
		this.menu.$elm.on("shown", function() {
			$('#fab').addClass('show');
		});
	}

}

TouchUI.prototype.DOM.create.headers = {

	init: function() {

		$('.row > .tabbable > .tab-content > div').each(function(ind, elm) {
			var $elm = $(elm);
			var text = $('[href="#' + $elm.attr("id") + '"]').text().trim();

			if ($elm.find('.accordion-heading').length > 0)
				return

			$('<div class="accordion-heading"><a href="#">' + text + '</a></div>').prependTo(elm);

		});

	}

}

TouchUI.prototype.DOM.create.tabbar = {

	createItem: function(itemId, linkId, toggle, text) {
		text = (text) ? text : "";
		return $('<li id="'+itemId+'"><a href="#'+linkId+'" data-toggle="'+toggle+'">'+text+'</a></li>');
	}
}

TouchUI.prototype.DOM.create.temperature = {

	menu: {
	},

	container: {
	},

	move: {
	},

	init: function() {
		var self = this;

		_.each(['foreach: tools', 'with: bedTemp'], function(key) {
			$('<!-- ko ' + key + ' -->' +
				'<div class="circle" data-bind="circle: { actual: actual, target: target }, slider: { max: ' + ((key === "with: bedTemp") ? '150, steps: 0.8' : '310, steps: 0.1') + ', value: target, enable: $root.isOperational() && $root.loginState.isUser() }' +
					((key === "with: bedTemp") ? ', visible: $parent.hasBed' : '') +'">' +
					'<span data-bind="html: name()"></span>' +
					'<div class="inner">' +
						'<span data-bind="html: actual() > 1 ? Math.floor(actual()) + \'°C\' : \'off\', visible: (actual() > 1)"></span>' +
						'<span data-bind="html: target() > 1 ? Math.floor(target()) + \'°C\' : \'off\'"></span>' +
					'</div>' +
				'</div>' +
				'<!-- /ko -->').appendTo("#temp");
		});

	}

}

TouchUI.prototype.DOM.create.webcam = {

	menu: {
		webcam: {
			cloneTo: "#control_link"
		}
	},

	container: {
		cloneTo: ".tab-content",

		webcam: {
			$container: $("#webcam_container"),
			cloneTo: "#webcam"
		}
	},

	init: function( tabbar ) {
		var self = this;

		this.container.$elm = $('<div id="webcam" class="tab-pane"></div>')
			.appendTo(this.container.cloneTo);

		this.menu.webcam.$elm = tabbar.createItem("webcam_link", "webcam", "tab")
			.insertAfter(this.menu.webcam.cloneTo);

		this.menu.webcam.$elm.children()
			.html('<span>Webcam</span>');

		this.container.webcam.$container.next().appendTo(this.container.webcam.cloneTo);
		this.container.webcam.$container.prependTo(this.container.webcam.cloneTo);

		$('<!-- ko allowBindings: false -->').insertBefore(this.container.$elm);
		$('<!-- /ko -->').insertAfter(this.container.$elm);

		$("#webcam_container").attr("data-bind", $("#webcam_container").attr("data-bind").replace("keydown: onKeyDown, ", ""));

	}

}

TouchUI.prototype.DOM.move.connection = {
	$container:			null,
	containerId:		"connection_dialog",
	$cloneContainer:	$("#usersettings_dialog"),
	$cloneModal:		$("#connection_wrapper"),
	cloneTo:			"#all_touchui_settings > div > ul",

	init: function( tabbar ) {
		var text = this.$cloneModal.find(".accordion-heading")
			.text()
			.trim();

		// Clone usersettings modal
		this.$container = this.$cloneContainer.clone()
			.attr("id", this.containerId)
			.insertAfter(this.$cloneContainer);

		this.$containerBody = this.$container
			.find(".modal-body");

		// Remove all html from clone
		this.$containerBody.empty();

		// Append tab contents to modal
		this.$cloneModal.appendTo(this.$containerBody);

		// Set modal header to accordion header
		this.$container.find(".modal-header h3")
			.text(text);

		// Create a link in the dropdown
		this.$menuItem = tabbar.createItem("conn_link_mirror", this.containerId, "modal", text)
			.attr("data-bind", "visible: loginState.isAdmin")
			.prependTo(this.cloneTo);
	}
}

TouchUI.prototype.DOM.move.controls = {

	init: function() {
		var feedrateBtn;

		// backward compatibility with <1.3.0
		if($('#control-jog-feedrate').length === 0) {
			var jogPanels = $('#control > .jog-panel');

			$(jogPanels[0]).find(".jog-panel:nth-child(1)").attr("id", "control-jog-xy");
			$(jogPanels[0]).find(".jog-panel:nth-child(2)").attr("id", "control-jog-z");
			$(jogPanels[1]).attr("id", "control-jog-extrusion");
			$(jogPanels[2]).attr("id", "control-jog-general");

			$('<div class="jog-panel" id="control-jog-feedrate"></div>').insertAfter($(jogPanels[2]));
			feedrateBtn = $(jogPanels[0]).find("> button:last-child").prependTo("#control-jog-feedrate");
			$(jogPanels[0]).find("> input:last-child").prependTo("#control-jog-feedrate");
			$(jogPanels[0]).find("> .slider:last-child").prependTo("#control-jog-feedrate");

		}

		// $("#control-jog-feedrate").attr("data-bind", $("#control-jog-extrusion").data("bind")).insertAfter("#control-jog-extrusion");
		feedrateBtn = feedrateBtn || $('#control-jog-feedrate button');
		var flowrateBtn = $("#control-jog-extrusion button:last-child").prependTo("#control-jog-feedrate");
		$("#control-jog-extrusion input:last-child").prependTo("#control-jog-feedrate");
		$("#control-jog-extrusion .slider:last-child").prependTo("#control-jog-feedrate");

		$("#control div.distance").prependTo("#control-jog-feedrate");
		$("#control-jog-feedrate").insertBefore("#control-jog-extrusion");

		$("#control-jog-general").appendTo($('#control > .jog-panel')[0]);

		var inner = $('<div class="accordion-inner touch-area"></div>').prependTo("#control");
		$("#control").children().appendTo(inner);
		var header = $('<div class="accordion-heading"><a href="#controls">Controls</a></div>').prependTo("#control");
		var cont = $('<div class="controls-heading" data-bind="visible: loginState.isUser()"></div>').appendTo(header);

		var steps = $('<a href="#"><span>Steps</span><button class="active" data-distance="10">10</button></div>').appendTo(cont);
		var flowrate = $('<a href="#"><span>'+flowrateBtn.text()+'</span><strong data-bind="text: flowRate() + \'%\'"></strong></div>').appendTo(cont);
		var feedrate = $('<a href="#"><span>'+feedrateBtn.text()+'</span><strong data-bind="text: feedRate() + \'%\'"></strong></div>').appendTo(cont);

		if ($('[data-distance]').length === -1) {
			steps.find('button').attr("data-bind", "text: distance()").removeAttr('data-distance');
		} else {
			// TODO: Remove backwards compatibility with OctoPrint >=1.2.10
			$('#jog_distance').remove();
			cont.attr('id', 'jog_distance');
		}

	}

}

TouchUI.prototype.DOM.move.navbar = {
	mainItems: ['#all_touchui_settings'/*, '#navbar_plugin_navbartemp', '#navbar_login', '#navbar_systemmenu','.hidden_touch'*/],
	init: function() {

		var self = this;
		var _each = function(ind, elm) {
			var $elm = $(elm);
			var $clone = $elm.clone()
				.appendTo(self.DOM.create.dropdown.container);

			$clone.children('> a')
				.text($elm.text().trim());

			if (this.mirror) {
				$clone.attr("id", $clone.attr("id") + "_mirror")
					.addClass("tabs-mirror")
					.children('a')
					.on("click", function(e) {
						e.preventDefault();
						e.stopPropagation();

						$elm.children('a').trigger("click", e);
					});
			} else {
				$elm.remove();
			}

		};

		var $tabs = $("#tabs > li");
		var $navbar = $("#navbar ul.nav > li:not("+this.DOM.move.navbar.mainItems+")");
		$tabs.each(_each.bind({ mirror: true }));
		$navbar.each(_each.bind({ mirror: false }));

		// Move TouchUI to main dropdown
		$("#navbar_plugin_touchui").insertAfter("#navbar_settings");

		// Create and Move login form to main dropdown
		$('<li id="navbar_login_settings"><ul id="youcanhazlogin"></ul></li>').insertAfter("#navbar_plugin_touchui");

		$('#navbar_login').appendTo('#youcanhazlogin')
			.find('a.dropdown-toggle')
			.text($('#youcanhazlogin').find('a.dropdown-toggle').text().trim());

		// Move the navbar temp plugin
		this.plugins.navbarTemp.call(this);

		// $('<div id="touchui_toggle_menu"><i class="fa fa-bars"></i></div>').appendTo('body').click(function() {
		// 	$('#all_touchui_settings > a').click();
		// });

		// Remove all text in the buttons
		var $items = $("#tabs > li > a");
		$items.each(function(ind, elm) {
			$(elm).text("");
		}.bind(this));

		// Set text on empty dropdown item
		$('#files_link_mirror a').html('<span>'+$('#files_wrapper .accordion-toggle').text().trim()+'</span>');
		$('#navbar_settings a').html($('#navbar_settings a').text().trim());
		$('#navbar_plugin_touchui a').html($('#navbar_plugin_touchui a').text().trim());

		$("#temp_link_mirror a").html('<span>' + $('#temp_link_mirror a').text() + '</span>')
			.find('span')
			.attr('data-bind', "text: appearance.name() == '' ? appearance.title : appearance.name");

		// Add hr before the settings icon
		$('<li class="divider"></li>').insertBefore("#navbar_settings");

		$('<li class="divider" id="divider_systemmenu" style="display: none;"></li>').insertBefore("#navbar_systemmenu")
			.attr("data-bind", $("#navbar_systemmenu").attr("data-bind"));

		// Dynamicly hide icons that don't fit on screen, and show the mirror
		$(window).on('resize', function(e) {
			var cutOff = 0.5;
			var itemHeight = $("#all_touchui_settings").height();
			var height = $(window).innerHeight() - (itemHeight - (itemHeight * cutOff));
			var $items = $('#tabs > li');
			var fitOnScreen = Math.floor(height / itemHeight);

			$items.slice(0, fitOnScreen).removeClass("hidden");
			$('.tabs-mirror').addClass("hidden");

			$items.slice(fitOnScreen).each(function(ind, elm) {
				$(elm).addClass("hidden");
				$("#" + $(elm).attr("id") + "_mirror").removeClass("hidden");
			});
		});

		// Force first calculation
		setTimeout(function touchUiResize() {
			$(window).trigger('resize');
		}, 0);

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

TouchUI.prototype.DOM.move.terminal = {

	init: function() {

		// Add version number placeholder
		// $('<span></span>').prependTo("#terminal-output");

		// Create iScroll container for terminal
		var container = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
		var inner = $('<div id="terminal-scroll-inner"></div>').appendTo(container);
		$("#terminal-output").appendTo(inner);
		$("#terminal-output-lowfi").appendTo(inner);

	}

};

TouchUI.prototype.DOM.overwrite.modal = function() {
	$.fn.modal.defaults.backdrop = false;
	$.fn.modal.defaults.manager = $('.octoprint-container > .row > .tabbable > .tab-content');

	$('.modal.fade').removeClass('fade');

	//We need a reliable event for catching new modals for attaching a scrolling bar
	$.fn.modalBup = $.fn.modal;
	$.fn.modal = function(option, args) {
		// Update any other modifications made by others (i.e. OctoPrint itself)
		$.fn.modalBup.defaults = $.fn.modal.defaults;

		$.fn.modal.defaults.manager.find('> .modal-scrollable').not($(this).parent()).addClass('modal-hidden');
		$.fn.modal.defaults.manager.find('> .tab-pane.active').removeClass('active').addClass('pre-active');

		// Create modal, store into variable so we can trigger an event first before return
		var $this = $(this);
		var tmp = $this.modalBup(option, args);

		if (option !== "hide") {
			$this.trigger('modal.touchui', this);

			// setTimeout(function() {
			// 	Materialize.updateTextFields();
			// }, 60);

			tmp.one('destroy', function() {
				if (!$.fn.modal.defaults.manager.find('> .modal-scrollable > .modal').not(this).length) {
					$.fn.modal.defaults.manager.find('> .tab-pane.pre-active').removeClass('pre-active').addClass('active');
				} else {
					var modals = $.fn.modal.defaults.manager.find('.modal-hidden');
					$(modals[modals.length-1]).removeClass('modal-hidden');
				}
			});

			$this
				.trigger('modal-destroy.touchui', this, tmp)
				.parent()
				.removeClass('modal-hidden');
		}

		return tmp;
	};
	$.fn.modal.prototype = { constructor: $.fn.modal };
	$.fn.modal.Constructor = $.fn.modal;
	$.fn.modal.defaults = $.fn.modalBup.defaults;

}

TouchUI.prototype.DOM.overwrite.tabbar = function() {

	// Force the webcam tab to load the webcam feed that original is located on the controls tab
	$('#tabs [data-toggle=tab], #all_touchui_settings [data-toggle=tab]').each(function(ind, elm) {

		// Get the currently attached events to the toggle
		var show = $.extend({}, jQuery._data(elm, "events").show);
		var shown = $.extend({}, jQuery._data(elm, "events").shown);
		var $elm = $(elm);
		var prev = {};

		delete show.delegateCount;
		delete shown.delegateCount;

		// Remove all previous set events and call them after manipulating a few things
		$elm.off("show").on("show", function(e) {
			var scope = this;
			var current = e.target.hash;
			var previous = prev.hash || "";
			prev = e.target;

			current = (current === "#control") ? "#control_without_webcam" : current;
			current = (current === "#webcam") ? "#control" : current;

			previous = (previous === "#control") ? "#control_without_webcam" : previous;
			previous = (previous === "#webcam") ? "#control" : previous;

			// Unset all is-active and active
			$("#tabs li, .tabs-mirror").removeClass('active').find('a').removeClass('is-active');

			// Add active and is-active to mirror or tabbar
			if ($(e.target).parents('#tabs').length) {
				$("#" + $(e.target).parent().attr('id') + "_mirror").addClass('active').find('a').addClass('is-active');
				$("#" + $(e.target).parent().attr('id') + "_clone").addClass('active').find('a').addClass('is-active');
			} else {
				$("#" + $(e.target).parent().attr('id').replace("_mirror", "")).addClass('active').find('a').addClass('is-active');
				$("#" + $(e.target).parent().attr('id').replace("_mirror", "_clone")).addClass('active').find('a').addClass('is-active');
			}

			// Call previous unset functions (e.g. let's trigger the event onTabChange in all the viewModels)
			if (show) {
				$.each(show, function(key, event) {
					event.handler.call(scope, {
						target: {
							hash: current
						},
						relatedTarget: {
							hash: previous
						}
					});
				});
			}
		});

		// Redo shown to give everyone the right previous
		$elm.off("shown").on("shown", function(e) {
			var scope = this;
			var current = e.target.hash;
			var previous = prev.hash || "";

			// Call previous unset functions (e.g. let's trigger the event onTabChange in all the viewModels)
			if (shown) {
				$.each(shown, function(key, event) {
					event.handler.call(scope, {
						target: {
							hash: current
						},
						relatedTarget: {
							hash: previous
						}
					});
				});
			}
		});
	});

}

TouchUI.prototype.DOM.overwrite.tabdrop = function() {
	$.fn.tabdrop = function() {};
	$.fn.tabdrop.prototype = { constructor: $.fn.tabdrop };
	$.fn.tabdrop.Constructor = $.fn.tabdrop;
}
