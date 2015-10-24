!function ($) {

	$.fn.TouchUI.DOM = {

		pluginLoaded: function() {
			if(
				document.location.hash === "#touch" ||
				document.location.href.indexOf("?touch") > 0 ||
				this.DOM.cookies.get("active") === "true"
			) {
				$("html").attr("id", this.id);

				// Force mobile browser to set the window size to their format
				$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
				$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
				$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");
				$('<span></span>').prependTo("#terminal-output");

				this.isActive = true;

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
					this.fullscreen.ask.call(this);
				} else {
					//Cookie say user wants fullscreen, ask it!
					if(this.DOM.cookies.get("fullscreen") === "true") {
						this.fullscreen.ask.call(this);
					}
				}

				// Get state of cookies
				this.keyboard.isActive = (this.DOM.cookies.get("keyboardActive") === "true");
				this.animate.isHidebarActive = (this.DOM.cookies.get("hideNavbarActive") === "true");
				this.isFullscreen = (this.DOM.cookies.get("fullscreen") === "true");

				// Set new printer tab as active
				$(".octoprint-container .tab-content .active").removeClass('active');

				// Create new tab with printer status and make it active
				this.DOM.create.printer.init( this.DOM.create.tabbar );
				this.DOM.create.printer.menu.$elm.find('a').trigger("click");

				// Create a new persistent dropdown
				this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

				// Move all other items from tabbar into dropdown
				this.DOM.move.tabbar.init.call( this );
				this.DOM.move.navbar.init.call( this );
				this.DOM.move.afterTabAndNav.call( this )
			}
		},

		init: function() {

			this.DOM.move.connection.init( this.DOM.create.tabbar );
			this.DOM.move.controls.init();

			if ($("#webcam_container").length > 0) {
				this.DOM.create.webcam.init( this.DOM.create.tabbar );
			}

			// Add class with how many tab-items
			$("#tabs, #navbar").addClass("items-" + $("#tabs li:not(.hidden_touch)").length);
		},

		create: {

			// Tabbar helper
			tabbar: {

				createItem: function(itemId, linkId, toggle, text) {
					text = (text) ? text : "";
					return $('<li id="'+itemId+'"><a href="#'+linkId+'" data-toggle="'+toggle+'">'+text+'</a></li>');
				}

			},

			// Create a persistent dropdown
			dropdown: {

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

			},

			// Create a print status and files link and tab
			printer: {

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
			},

			// Create a tab with webcam feed, and move timelapse into settings dropdown
			webcam: {

				menu: {
					webcam: {
						cloneTo: "#term_link"
					}
				},

				container: {
					cloneTo: "#timelapse",

					webcam: {
						$container: $("#webcam_container"),
						cloneTo: "#webcam"
					}
				},

				init: function( tabbar ) {
					var self = this;

					this.container.$elm = $('<div id="webcam" class="tab-pane"></div>').insertAfter(this.container.cloneTo);
					this.menu.webcam.$elm = tabbar.createItem("webcam_link", "webcam", "tab").insertBefore(this.menu.webcam.cloneTo);

					this.container.webcam.$container.next().appendTo(this.container.webcam.cloneTo);
					this.container.webcam.$container.prependTo(this.container.webcam.cloneTo);

				}
			}
		},

		move: {

			afterTabAndNav: function() {

				this.DOM.create.dropdown.container.children().each(function(ind, elm) {
					var $elm = $(elm);
					$('<!-- ko allowBindings: false -->').insertBefore($elm);
					$('<!-- /ko -->').insertAfter($elm);
				});

				// Force dropdown in menu to not close the main dropdown
				$('#all_touchui_settings > ul li .dropdown-toggle').on("mousedown touchstart", function(e) {
					$(e.target).toggleClass("active");
					$(e.target).siblings().toggleClass("dropdown-menu").toggleClass("dropdown").toggleClass("open");

					e.stopPropagation();
					e.preventDefault();
					return false;
				}).click(function(e) {
					e.preventDefault();
					return false;
				});
			},

			// Move all items, exepct this mainTabItems into the dropdown
			tabbar: {
				mainItems: ['#print_link', '#temp_link', '#control_link', '#webcam_link', '#term_link', '.hidden_touch'],
				init: function() {

					$items = $("#tabs > li:not("+this.DOM.move.tabbar.mainItems+")");
					$items.each(function(ind, elm) {
						var $elm = $(elm);

						// Clone the items into the dropdown, and make it click the orginal link
						$elm.clone().attr("id", $elm.attr("id")+"2").appendTo("#all_touchui_settings .dropdown-menu").find('a').click(function(e) {
							$elm.find('a').click();
							e.preventDefault();
							return false;
						});
						$elm.addClass("hidden_touch");

					}.bind(this));

				}
			},

			navbar: {
				mainItems: ['#all_touchui_settings', '#navbar_plugin_navbartemp', "#navbar_login", /*'#navbar_systemmenu',*/ '.hidden_touch'],
				init: function() {

					$items = $("#navbar ul.nav > li:not("+this.DOM.move.navbar.mainItems+")");
					$items.each(function(ind, elm) {
						var $elm = $(elm);
						$elm.appendTo(this.DOM.create.dropdown.container);
						$elm.find('a').text($elm.text().trim());

					}.bind(this));

					$("#navbar_plugin_touchui").insertAfter("#navbar_settings");
					$('<li><ul id="youcanhazlogin"></ul></li>').insertAfter("#navbar_plugin_touchui");
					$('#navbar_login').appendTo('#youcanhazlogin').find('a.dropdown-toggle').text($('#youcanhazlogin').find('a.dropdown-toggle').text().trim());

					// Manually move system commands
					// if( $("#navbar_systemmenu").length > 0 ) {
					// 	var dropdownMenu = $("#navbar_systemmenu").find(".dropdown-menu");
					// 	$("#navbar_systemmenu").appendTo(this.DOM.create.dropdown.container).find("a").on("mousedown touchstart", function(e) {
					// 		$(e.target).toggleClass("active");
					// 		dropdownMenu.toggleClass("dropdown-menu").toggleClass("dropdown").toggleClass("open");
					//
					// 		e.stopPropagation();
					// 		e.preventDefault();
					// 		return false;
					// 	}).click(function(e) {
					// 		e.preventDefault();
					// 		return false;
					// 	}).text($("#navbar_systemmenu").find('a').text().trim());
					// 	$('<li class="divider"></li>').insertBefore("#navbar_systemmenu");
					// }

					// Manually move navbar temp (hard move)
					if( $("#navbar_plugin_navbartemp").length > 0 ) {
						var navBarTmp = $("#navbar_plugin_navbartemp").appendTo(this.DOM.create.dropdown.container);
						$('<li class="divider"></li>').insertBefore(navBarTmp);
						$("<!-- ko allowBindings: false -->").insertBefore(navBarTmp);
						$("<!-- /ko -->").insertAfter(navBarTmp);
					}

					//Add hr before the settings icon
					$('<li class="divider"></li>').insertBefore("#navbar_settings");

				}
			},

			//Move the connection accordion tab to a modal and add it to the settings dropdown
			connection: {
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
			},

			// Move feed rate into new div and move flow rate
			controls: {

				init: function() {

					var jogPanels = $('#control > .jog-panel');

					$(jogPanels[0]).attr("id", "x-y-panel");
					$(jogPanels[1]).attr("id", "e-panel");
					$(jogPanels[2]).attr("id", "extra-panel");

					var tmp = $('<div class="jog-panel" id="rate-panel" data-bind="'+$(jogPanels[0]).data("bind")+'"></div>').insertAfter($(jogPanels[2]));

					$(jogPanels[0]).children('button:last-child').appendTo(tmp);
					$(jogPanels[0]).children('[type="number"]:last-child').appendTo(tmp);
					$(jogPanels[0]).children('.slider:last-child').appendTo(tmp);

					$(jogPanels[1]).find('div > button:last-child').appendTo(tmp);
					$(jogPanels[1]).find('div > [type="number"]:last-child').appendTo(tmp);
					$(jogPanels[1]).find('div > .slider:last-child').appendTo(tmp);

				}

			}

		},

		cookies: {

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

	};

}(window.jQuery);
