var TouchUI = function() {
	this.core.init.call(this);
	return this.core.bridge.call(this);
};

TouchUI.prototype = {
	id: "touch",
	version: 0,

	isActive: ko.observable(false),
	isFullscreen: ko.observable(false),

	isTouch: (('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0)),
	canLoadAutomatically: $("#loadsomethingsomethingdarkside").length > 0,

	hiddenClass: "hidden_touch",
	visibleClass: "visible_touch",

	constructor: TouchUI,

	/* Placeholders */
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
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true,
				disablePointer: true
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

			if( this.isTouch ) {
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
		var self = this,
			namespace = ".touchui.dropdown";

		$(document)
			.off('.dropdown')
			.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
			.on('click.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
				var $dropdownToggle = $(e.currentTarget),
					$dropdownContainer = $dropdownToggle.parent();

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

				$(document).off("click"+namespace).on("click"+namespace, function(eve) {
					// Check if we scrolled (touch devices wont trigger this click event after scrolling so assume we didn't move)
					var moved = ( !self.isTouch ) ? self.scroll.currentActive.moved : false,
						$target = $(eve.target);

					if (
						!moved && // If scrolling did not move
						$target.parents(".ui-pnotify").length === 0 && // if not a click within notifiaction
						(
							!$target.parents().is($dropdownContainer) || // if clicks are not made within the dropdown container
							$target.is('a:not([data-toggle])') // Unless it's a link but not a [data-toggle]
						)
					) {
						$(document).off(eve);
						$dropdownContainer.removeClass('open');

						if ( !self.isTouch ) {
							$('.octoprint-container').css("min-height", 0);
							self.scroll.currentActive.refresh();
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
		if ( !self.isTouch ) {
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
			self.isFullscreen($(document).fullScreen() !== false);
			self.DOM.cookies.set("fullscreen", self.isFullscreen());
		});

	},
	ask: function() {
		var self = this;

		if(
			document.webkitCancelFullScreen ||
			document.msCancelFullScreen ||
			document.oCancelFullScreen ||
			document.mozCancelFullScreen ||
			document.cancelFullScreen
		) {
			new PNotify({
				title: 'Fullscreen',
				text: 'Would you like to go fullscreen?',
				icon: 'glyphicon glyphicon-question-sign',
				type: 'info',
				hide: false,
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

				if(!self.isTouch) {

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
			var settingsLabel = $("<span></span>")
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
							var href = settingsLabel.find(".active").find('[data-toggle="tab"]').attr("href");
							$(document).off(event).trigger("dropdown-closed.touchui"); // Trigger event for enabling scrolling

							$('.show-dropdown').remove();
							$('[href="'+href+'"]').click();
							settingsLabel.text($('[href="'+href+'"]').text());

							if( !self.isTouch ) {
								setTimeout(function() {
									self.scroll.modal.stack[self.scroll.modal.stack.length-1].refresh();
								}, 0);
							}
						}

					});

					// Trigger event for disabling scrolling
					$(document).trigger("dropdown-open.touchui", elm[0]);
				});
		}
	}
}

TouchUI.prototype.components.slider = {

	init: function() {

		// Destroy bootstrap control sliders
		$('#control .slider').each(function(ind, elm) {
			var $elm = $(elm);
			var $next = $(elm).next();
			var text = $next.text().split(":")[0].replace(" ", "");
			var sliderObj = ko.jsonExpressionRewriting.parseObjectLiteral($elm.find("input").attr("data-bind"));
			var obj = ko.jsonExpressionRewriting.parseObjectLiteral(sliderObj[0].value);
			var slider = {};

			_.each(obj, function(elm, ind) {
				slider[elm.key.trim()] = elm.value.trim();
			});

			var valKey = slider.value;
			delete slider.value;
			delete slider.tooltip;

			$elm.addClass("hidden");

			var div = $('<div class="slider-container"></div>').insertAfter($elm);

			$elm.appendTo(div);
			$next.appendTo(div);

			$('<input type="number" id="ui-inp-'+ind+'">')
				.attr("data-bind", "enable: isOperational() && loginState.isUser(), value: " + valKey)
				.attr(slider)
				.appendTo(div);

			$('<label for="ui-inp-'+ind+'"></label>')
				.appendTo(div)
				.text(text + ":");
		});

	}

}

TouchUI.prototype.components.touchList = {
	init: function() {

		/* Add touch friendly files list */
		var self = this,
			touch = false,
			start = 0,
			namespace = ".files.touchui";

		$(document).on("mousedown touchstart", "#files .entry, #temp .row-fluid", function(e) {
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

TouchUI.prototype.core.bridge = function() {
	var self = this;

	return {
		_instance: this,

		isActive: this.isActive,
		isKeyboardActive: this.components.keyboard.isActive,
		isHidebarActive: this.animate.isHidebarActive,
		isFullscreen: this.isFullscreen,

		domLoading: function() {
			if(self.isActive()) {
				self.scroll.beforeLoad.call(self);
				self.DOM.init.call(self);
				self.DOM.overwrite.tabdrop.call(self);
				self.DOM.overwrite.modal.call(self);
			}
		},

		domReady: function() {
			if(self.isActive()) {
				self.components.dropdown.init.call(self);
				self.components.fullscreen.init.call(self);
				self.components.keyboard.init.call(self);
				self.components.modal.init.call(self);
				self.components.touchList.init.call(self);

				self.scroll.init.call(self);
			}
		},

		koReady: function(touchViewModel, viewModels) {
			if(self.isActive()) {
				self.components.slider.init.call(self);
				self.DOM.overwrite.tabbar.call(self);

				self.settings = touchViewModel.settings || {};
				self.knockout.isReady.call(self, touchViewModel, viewModels);
				self.plugins.init.call(self, touchViewModel, viewModels);
			}
		},

		toggleTouch: function() {
			if(self.DOM.cookies.toggleBoolean("active")) {
				document.location.hash = "#touch";
			} else {
				document.location.hash = "";
			}
			document.location.reload();
		},

		toggleKeyboard: function() {
			if(self.isActive()) {
				self.components.keyboard.isActive(self.DOM.cookies.toggleBoolean("keyboardActive"));
			}
		},

		toggleHidebar: function() {
			if(self.isActive()) {
				self.animate.isHidebarActive(self.DOM.cookies.toggleBoolean("hideNavbarActive"));
			}
		},

		toggleFullscreen: function() {
			$(document).toggleFullScreen();
		},

		onTabChange: function() {
			if(self.isActive()) {
				if( !self.isTouch ) {
					if(self.scroll.currentActive) {
						self.animate.hide.call(self, "navbar");
						self.scroll.currentActive.refresh();
						setTimeout(function() {
							self.scroll.currentActive.refresh();
						}, 0);
					}
				}
			}
		}

	};

}

TouchUI.prototype.core.checkAutoLoad = function() {

	// This should always start TouchUI
	if(
		document.location.hash === "#touch" ||
		document.location.href.indexOf("?touch") > 0 ||
		this.DOM.cookies.get("active") === "true"
	) {

		return true;

	} else if(
		this.canLoadAutomatically &&
		this.DOM.cookies.get("active") !== "false"
	) {

		if($(window).width() < 980) {
			return true;
		}

		if(this.isTouch) {
			return true;
		}

	}

	return false;

}

TouchUI.prototype.core.exception = function() {

	var old = window.onerror || function() {};
	window.onerror = function() {
		old.call(this, arguments);

		// Supress these errors
		if(arguments[0].indexOf("CanvasRenderingContext2D") > -1) {//Failed to execute 'arc' on 'CanvasRenderingContext2D'
			return;
		}
		if(arguments[0].indexOf("highlightFill") > -1) {//Cannot read property 'highlightFill'
			return;
		}

		var text = '<p>Please help improving this plugin by <a href="https://github.com/BillyBlaze/OctoPrint-TouchUI/issues/new?body={BODY}">submiting</a> the following error together with the OctoPrint version and browser you\'re using: </p><ul><li>',
			err = '',
			body = '';

		if(arguments.length > 4) {
			err += "<strong>" + arguments[4].message + "</strong><br>";
			err += "<small>" + arguments[4].stack + "</small>";
		} else {
			err += "<strong>" + arguments[0] + "</strong><br>";
			err += "<small>" + arguments[1] + " @ " + arguments[2] + "</small>";
		}

		text += err + "</li></ul>";
		body = encodeURIComponent("\n\n\n------- \n````\n" + err.replace(/(<br>)/g, "\n").replace(/(<([^>]+)>)/g, "") + "\n````");

		new PNotify({
			title: 'TouchUI: Javascript error...',
			text:  text.replace("{BODY}", body),
			icon: 'glyphicon glyphicon-question-sign',
			type: 'error',
			hide: false,
			confirm: false
		});

	}
}

TouchUI.prototype.core.version = {

	init: function(softwareUpdateViewModel) {
		var self = this;

		$("<span></span>").appendTo("#terminal-output");

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

TouchUI.prototype.core.init = function() {

	if( this.core.checkAutoLoad.call(this) ) {
		this.core.exception(); //enable errors

		$("html").attr("id", this.id);

		// Force mobile browser to set the window size to their format
		$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
		$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
		$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");
		$('<span></span>').prependTo("#terminal-output");

		this.isActive(true);

		// Enforce active cookie
		this.DOM.cookies.set("active", "true");

		// Create keyboard cookie if not existing
		if(this.DOM.cookies.get("keyboardActive") === undefined) {
			if(!this.isTouch) {
				this.DOM.cookies.set("keyboardActive", "true");
			} else {
				this.DOM.cookies.set("keyboardActive", "false");
			}
		}

		// Create hide navbar on click if not existing
		if(this.DOM.cookies.get("hideNavbarActive") === undefined) {
			this.DOM.cookies.set("hideNavbarActive", "false");
		}

		// Create fullscreen cookie if not existing and trigger pNotification
		if(this.DOM.cookies.get("fullscreen") === undefined) {
			this.DOM.cookies.set("fullscreen", "false");
			this.components.fullscreen.ask.call(this);
		} else {
			//Cookie say user wants fullscreen, ask it!
			if(this.DOM.cookies.get("fullscreen") === "true") {
				this.components.fullscreen.ask.call(this);
			}
		}

		// Get state of cookies and store them in KO
		this.components.keyboard.isActive(this.DOM.cookies.get("keyboardActive") === "true");
		this.animate.isHidebarActive(this.DOM.cookies.get("hideNavbarActive") === "true");
		this.isFullscreen(this.DOM.cookies.get("fullscreen") === "true");

	}

}

TouchUI.prototype.DOM.cookies = {

	get: function(key) {
		var name = "TouchUI." + key + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return undefined;
	},

	set: function(key, value) {
		var d = new Date();
		d.setTime(d.getTime()+(360*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = "TouchUI." + key + "=" + value + "; " + expires;
	},

	toggleBoolean: function(key) {
		var value = $.parseJSON(this.get(key) || "false");

		if(value === true) {
			this.set(key, "false");
		} else {
			this.set(key, "true");
		}

		return !value;

	}

}

TouchUI.prototype.DOM.init = function() {

	// Create new tab with printer status and make it active
	this.DOM.create.printer.init( this.DOM.create.tabbar );
	this.DOM.create.printer.menu.$elm.find('a').trigger("click");

	// Create a new persistent dropdown
	this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

	// Move all other items from tabbar into dropdown
	this.DOM.move.tabbar.init.call( this );
	this.DOM.move.navbar.init.call( this );
	this.DOM.move.afterTabAndNav.call( this );
	this.DOM.move.overlays.init.call( this );

	// Move connection sidebar into a new modal
	this.DOM.move.connection.init( this.DOM.create.tabbar );

	// Manipulate controls div
	this.DOM.move.controls.init();

	// Add a webcam tab if it's defined
	if ($("#webcam_container").length > 0) {
		this.DOM.create.webcam.init( this.DOM.create.tabbar );
	}

	// Add class with how many tab-items
	$("#tabs, #navbar").addClass("items-" + $("#tabs li:not(.hidden_touch)").length);

	// Remove active class when clicking on a tab in the tabbar
	$('#tabs [data-toggle=tab]').on("click", function() {
		$("#all_touchui_settings").removeClass("item_active");
	});

}

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

TouchUI.prototype.plugins.init = function(touchViewModel, viewModels) {
	this.plugins.screenSquish(viewModels.pluginManagerViewModel);
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
		var self = this,
			scrollStart = false,
			$noPointer = $('.page-container');

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

TouchUI.prototype.scroll.overwrite = function(terminalViewModel) {
	var self = this;

	if ( !this.isTouch ) {

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
			self.scroll.iScrolls.body.scrollTo(0, 0, 500);
			showOfflineOverlay.call(this, title, message, reconnectCallback);
		};

		// Overwrite orginal helper, add one step and call the orginal function
		var showConfirmationDialog = window.showConfirmationDialog;
		window.showConfirmationDialog = function(message, onacknowledge) {
			self.scroll.iScrolls.body.scrollTo(0, 0, 500);
			showConfirmationDialog.call(this, message, onacknowledge);
		};

		// Well this is easier, isn't it :D
		$("#reloadui_overlay").on("show", function() {
			self.scroll.iScrolls.body.scrollTo(0, 0, 500);
		});

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

TouchUI.prototype.scroll.beforeLoad = function() {

	// Manipulate DOM for iScroll before knockout binding kicks in
	if (!this.isTouch) {
		$('<div id="scroll"></div>').insertBefore('.page-container');
		$('.page-container').appendTo("#scroll");
	}

	// Create iScroll container for terminal anyway, we got styling on that
	var cont = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
	$("#terminal-output").appendTo(cont);

}

TouchUI.prototype.scroll.init = function() {
	var self = this;

	if ( this.isTouch ) {
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

		// Refresh body on dropdown click
		$(document).on("click", ".pagination ul li a", function() {
			setTimeout(function() {
				self.scroll.currentActive.refresh();
			}, 0);
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
					$('navbar_show_settings').text() +
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
			cloneTo: "#term_link"
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

		this.container.$elm = $('<div id="webcam" class="tab-pane"></div>').appendTo(this.container.cloneTo);
		this.menu.webcam.$elm = tabbar.createItem("webcam_link", "webcam", "tab").insertBefore(this.menu.webcam.cloneTo);

		this.container.webcam.$container.next().appendTo(this.container.webcam.cloneTo);
		this.container.webcam.$container.prependTo(this.container.webcam.cloneTo);

		$('<!-- ko allowBindings: false -->').insertBefore(this.container.$elm);
		$('<!-- /ko -->').insertAfter(this.container.$elm);

		$("#webcam_container").attr("data-bind", $("#webcam_container").attr("data-bind").replace("keydown: onKeyDown, ", ""));

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
		this.$menuItem = tabbar.createItem("conn_link2", this.containerId, "modal", text).prependTo(this.cloneTo);
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
	mainItems: ['#all_touchui_settings', '#navbar_plugin_navbartemp', '#navbar_login', /*'#navbar_systemmenu',*/ '.hidden_touch'],
	init: function() {

		$items = $("#navbar ul.nav > li:not("+this.DOM.move.navbar.mainItems+")");
		$items.each(function(ind, elm) {
			var $elm = $(elm);
			$elm.appendTo(this.DOM.create.dropdown.container);
			$elm.find('a').text($elm.text().trim());
		}.bind(this));

		// Move TouchUI to main dropdown
		$("#navbar_plugin_touchui").insertAfter("#navbar_settings");

		// Create and Move login form to main dropdown
		$('<li><ul id="youcanhazlogin"></ul></li>').insertAfter("#navbar_plugin_touchui");
		$('#navbar_login').appendTo('#youcanhazlogin').find('a.dropdown-toggle').text($('#youcanhazlogin').find('a.dropdown-toggle').text().trim());

		// Move the navbar temp plugin
		this.plugins.navbarTemp.call(this);

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
	mainItems: ['#print_link', '#temp_link', '#control_link', '#webcam_link', '#term_link', '.hidden_touch'],
	init: function() {

		$items = $("#tabs > li:not("+this.DOM.move.tabbar.mainItems+")");
		$items.each(function(ind, elm) {
			var $elm = $(elm);

			// Clone the items into the dropdown, and make it click the orginal link
			$elm.clone().attr("id", $elm.attr("id")+"2").appendTo("#all_touchui_settings .dropdown-menu").find('a').off("click").on("click", function(e) {
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

	}
}

TouchUI.prototype.DOM.overwrite.modal = function() {

	if( !this.isTouch ) {
		//We need a reliable event for catching new modals for attaching a scrolling bar
		$.fn.modalBup = $.fn.modal;
		$.fn.modal = function(option, args) {
			// Update any other modifications made by others (i.e. OctoPrint itself)
			$.fn.modalBup.defaults = $.fn.modal.defaults;

			// Create modal, store into variable so we can trigger an event first before return
			var tmp = $(this).modalBup(option, args);
			$(this).trigger("modal.touchui", this);

			return tmp;
		};
		$.fn.modal.prototype = { constructor: $.fn.modal };
		$.fn.modal.Constructor = $.fn.modal;
		$.fn.modal.defaults = $.fn.modalBup.defaults;
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
