!function ($) {

	$.fn.TouchUI.DOM = {

		pluginLoaded: function() {
			if( document.location.hash === "#touch" || document.location.href.indexOf("?touch") !== -1 || this.DOM.cookies.get("active") === "true") {
				$("html").attr("id", this.id);

				// Force mobile browser to set the window size to their format
				$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
				$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
				$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");

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
					this.DOM.cookies.set("hideNavbarActive", "true");
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

				// $("#terminal-output span").attr("data-bind", $("#terminal-output span").attr("data-bind").replace("text: line", "html: line"));
				$(".octoprint-container .tab-content .active").removeClass('active');

				this.DOM.create.printer.init( this.DOM.create.tabbar );
				this.DOM.create.printer.menu.$elm.find('a').trigger("click");
			}
		},

		init: function() {

			this.DOM.move.connection.init( this.DOM.create.tabbar );
			this.DOM.move.settings.init( this.DOM.create.tabbar );
			this.DOM.move.gcode.init( this.DOM.create.tabbar );
			this.DOM.move.controls.init();

			if ($("#webcam_container").length > 0) {
				this.DOM.create.webcam.init( this.DOM.create.tabbar );
			}

			// Remove unwanted spaces
			$("#navbar_settings2 a").html($("#navbar_settings2 a").text().trim());

			//Add hr before the settings icon
			$('<li class="divider"></li>').insertBefore("#navbar_settings2");

			// Move all other items from tabbar into dropdown
			this.DOM.move.tabs.init();

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
					},
					timelapse: {
						$cloneContainer: $("#timelapse_link"),
						cloneId: "timelapse_link2",
						cloneTo: "#conn_link2"
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

					this.menu.timelapse.$elm = this.menu.timelapse.$cloneContainer
						.clone()
						.attr("id", this.menu.timelapse.cloneId)
						.insertAfter(this.menu.timelapse.cloneTo)
						.click(function(e) {
							e.preventDefault();
							e.stopPropagation();

							self.menu.timelapse.$cloneContainer.find("a").click();
						});

					this.container.$elm = $('<div id="webcam" class="tab-pane"></div>').insertAfter(this.container.cloneTo);
					this.menu.webcam.$elm = tabbar.createItem("webcam_link", "webcam", "tab").insertBefore(this.menu.webcam.cloneTo);

					this.container.webcam.$container.next().appendTo(this.container.webcam.cloneTo);
					this.container.webcam.$container.prependTo(this.container.webcam.cloneTo);

					// Hide orginal link
					this.menu.timelapse.$cloneContainer.addClass("hidden_touch");

				}
			}
		},

		move: {

			// Move all items, exepct this mainTabItems into the dropdown
			tabs: {
				mainTabItems: ['#print_link', '#temp_link', '#control_link', '#webcam_link', '#term_link', '.hidden_touch'],
				init: function() {
					$items = $("#tabs li:not("+this.mainTabItems+")");
					$items.each(function(ind, elm) {
						var $elm = $(elm);

						// Clone the items into the dropdown, and make it click the orginal link
						$elm.clone().attr("id", $elm.attr("id")+"2").appendTo("#login_dropdown_loggedin").click(function(e) {
							$elm.click();
							e.preventDefault();
							return false;
						});
						$elm.addClass("hidden_touch");
					});

					var dropdownMenu = $("#navbar_systemmenu").find(".dropdown-menu");
					$("#navbar_systemmenu").appendTo("#login_dropdown_loggedin").find("a").click(function(e) {
						$(e.target).toggleClass("active");
						dropdownMenu.toggleClass("dropdown-menu").toggleClass("dropdown").toggleClass("open");

						e.preventDefault();
						return false;
					}).text($("#navbar_systemmenu").find('a').text().trim());
				}
			},

			//Move the connection accordion tab to a modal and add it to the settings dropdown
			connection: {
				$container: null,
				containerId: "connection_dialog",
				$cloneContainer: $("#usersettings_dialog"),
				$cloneModal: $("#connection_wrapper"),
				cloneTo: "#login_dropdown_loggedin",

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

			// Move the G-CODE viewer, hide the orginal and place it in the dropdown
			gcode: {
				$item: $("#gcode_link"),
				cloneId: "gcode_link2",
				cloneTo: "#conn_link2",

				init: function() {
					var self = this;

					this.$item.clone().attr("id", this.cloneId).insertAfter(this.cloneTo).click(function(e) {
						e.preventDefault();
						e.stopPropagation();

						self.$item.find("a").click();
					});

					this.$item.addClass("hidden_touch");
				}
			},

			// Move the settings option into the dropdown for more screen
			settings: {
				$item: $("#navbar_settings"),
				cloneId: "navbar_settings2",
				cloneTo: "#conn_link2",
				findLinkWithin: "#navbar_show_settings",

				init: function( tabbar ) {
					var self = this;

					// Clone the navbar settings item
					this.$cloneItem = this.$item.clone().attr("id", this.cloneId).insertAfter(this.cloneTo);

					// Remove binding and clicks from clone
					this.$cloneItem.find(this.findLinkWithin).attr("data-bind", "").attr("id", "").click(function(e) {
						e.preventDefault();

						// Pass on the click to the orginal element
						self.$item.find(self.findLinkWithin).click();
					});
				}
			},

			// Move feed rate into new div and move flow rate
			controls: {

				init: function() {

					var jogPanels = $('#control > .jog-panel');
					var tmp = $('<div class="jog-panel" data-bind="'+$(jogPanels[0]).data("bind")+'"></div>').appendTo('#control');

					$(jogPanels[0]).attr("id", "x-y-panel");
					$(jogPanels[1]).attr("id", "e-panel");
					$(jogPanels[2]).attr("id", "extra-panel");

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
