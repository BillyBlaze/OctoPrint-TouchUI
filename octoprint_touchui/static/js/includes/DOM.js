!function ($) {

	$.fn.TouchUI.DOM = {

		init: function() {

			this.DOM.move.connection.init( this.DOM.create.tabbar );
			this.DOM.move.settings.init( this.DOM.create.tabbar );
			this.DOM.create.printer.init( this.DOM.create.tabbar );
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

		},

		create: {

			// Tabbar helper
			tabbar: {

				createItem: function(itemId, linkId, toggle, text) {
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
					this.container.$elm = $('<div id="printer" class="tab-pane"><div class="row-fluid"></div></div>').insertBefore(this.container.cloneTo);

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
						$elm.clone().attr("id", $elm.attr("id")+"2").appendTo('#login_dropdown_loggedin').click(function(e) {
							e.preventDefault();
							$elm.click();
							return false;
						});
						$elm.addClass("hidden_touch");
					});
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
						// Pass on the click to the orginal element
						self.$item.find(self.findLinkWithin).click();
					});
				}
			},

			// Move feed rate into new div and move flow rate
			controls: {

				init: function() {

					var tmp = $('<div class="jog-panel"></div>').appendTo('#control');

					var jogPanels = $('#control > .jog-panel');

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
				return "";
			},

			set: function(key, value) {
				var d = new Date();
				d.setTime(d.getTime()+(360*24*60*60*1000));
				var expires = "expires="+d.toUTCString();
				document.cookie = "TouchUI." + key + "=" + value + "; " + expires;
			}

		}

	};

}(window.jQuery);
