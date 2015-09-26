!function ($) {

	$.fn.TouchUI.DOM = {

		create: {

			init: function() {

				this.DOM.create.connection.init.call(this);
				this.DOM.create.settings.init.call(this);
				this.DOM.create.printer.init.call(this);
				this.DOM.create.gcode.init.call(this);

				if ($("#webcam_container").length > 0) {
					this.DOM.create.webcam.init.call(this);
				}

				// Remove unwanted spaces
				$("#navbar_settings2 a").html($("#navbar_settings2 a").text().trim());

				//Add hr after the G-CODE viewer
				$('<li class="divider"></li>').insertBefore("#navbar_settings2");
			},

			connection: {
				//Move the connection accordion tab to a modal and add it to the settings dropdown
				init: function() {
					var self = this,
						text = $("#connection_wrapper .accordion-heading").text().trim();

					// Clone usersettings modal
					var modal = $("#usersettings_dialog").clone().attr("id", "connection_dialog").insertAfter("#usersettings_dialog");

					// Remove all html from clone
					modal.find(".modal-body").html("");

					// Append tab contents to modal
					$("#connection_wrapper").appendTo(modal.find(".modal-body"))

					// Set modal header to accordion header
					modal.find(".modal-header h3").text(text);

					// Create a link in the dropdown
					$('<li id="conn_link2"><a href="#connection_dialog" data-toggle="modal">'+text+'</a></li>').prependTo("#login_dropdown_loggedin");
				}
			},

			printer: {
				init: function() {
					// Create a print status and files link and tab
					$('<li id="print_link"><a href="#printer" data-toggle="tab"></a></li>').insertBefore("#tabs li:first-child");
					$('<div id="printer"><div class="row-fluid"></div></div>').addClass("tab-pane").insertBefore("#temp");
				}
			},

			gcode: {
				init: function() {
					// Clone the G-CODE viewer, hide the orginal and place it in the dropdown
					$("#gcode_link").clone().attr("id", "gcode_link2").insertAfter("#conn_link2").click(function(e) {
						e.preventDefault();
						e.stopPropagation();

						$("#gcode_link a").click();
					});
					$("#gcode_link").addClass("hidden_touch");;
				}
			},

			settings: {
				init: function() {
					// Move the settings option into the dropdown for more screen
					var tmp = $("#navbar_settings").clone().attr("id", "navbar_settings2")
					var tmp2 = tmp.find("#navbar_show_settings").attr("data-bind", "").attr("id", "");

					tmp.insertAfter($('#conn_link2'));
					tmp2.click(function(e) {
						$("#navbar_settings").find("a").click();
					});
				}
			},

			webcam: {
				init: function() {
					var self = this.DOM.create.webcam;

					$("#timelapse_link").clone().attr("id", "timelapse_link2").insertAfter("#conn_link2").click(function(e) {
						e.preventDefault();
						e.stopPropagation();

						$("#timelapse_link a").click();
					});

					self.container = $('<div id="webcam" class="tab-pane"></div>').insertAfter("#timelapse");
					self.menuItem = $('<li id="webcam_link"><a href="#webcam" data-toggle="tab"></a></li>').insertBefore("#term_link");

					$("#webcam_container + div").appendTo("#webcam");
					$("#webcam_container").prependTo("#webcam");
					$("#timelapse_link").addClass("hidden_touch");

				}
			}
		},

		move: {

			init: function() {

				this.DOM.move.controls.init();

				// Move the contents of the hidden accordions to the new print status and files tab
				$('#state_wrapper').appendTo("#printer .row-fluid");
				$('#files_wrapper').insertAfter("#printer .row-fluid #state_wrapper");

			},

			controls: {

				init: function() {

					//Copy feed rate into new div and grab flow rate
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
