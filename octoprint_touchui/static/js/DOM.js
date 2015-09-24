window.TouchUI = window.TouchUI || {};
window.TouchUI.DOM = {
	
	create: {
		
		init: function() {
			
			this.settings.init();
			this.printer.init();
			this.gcode.init();
			
			if ($("#webcam_container").length > 0) {
				this.webcam.init();
			}

			// Remove unwanted spaces
			$("#navbar_settings2 a").html($("#navbar_settings2 a").text().trim());
			
			//Add hr after the G-CODE viewer
			$('<li class="divider"></li>').insertBefore("#navbar_settings2");
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
				
				$("#timelapse_link").clone().attr("id", "timelapse_link2").insertAfter("#conn_link2").click(function(e) {
					e.preventDefault();
					e.stopPropagation();
					
					$("#timelapse_link a").click();
				});
				this.container = $('<div id="webcam" class="tab-pane"></div>').insertAfter("#timelapse");
				this.menuItem = $('<li id="webcam_link"><a href="#webcam" data-toggle="tab"></a></li>').insertBefore("#term_link");
				$("#webcam_container + div").appendTo("#webcam");
				$("#webcam_container").prependTo("#webcam");
				$("#timelapse_link").addClass("hidden_touch");
				
			}
		}
	},
	
	move: {
		
		init: function() {

			this.controls.init();
			
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
		
	}
	
};