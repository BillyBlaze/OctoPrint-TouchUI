window.TouchUI = window.TouchUI || {};
window.TouchUI.main = {
	init: function() {
		$("html").attr("id", "touch");
	},
	
	knockout: {
		
		isReady: function() {

			// Remove slimScroll from files list
			$('.gcode_files').slimScroll({destroy: true});
			$('.slimScrollDiv').slimScroll({destroy: true});

			// Remove drag files into website feature
			$(document).off("dragover");
			
			// Move the contents of the hidden accordions to the new print status and files tab
			$('#state_wrapper').appendTo("#printer .row-fluid");
			$('#files_wrapper').insertAfter("#printer .row-fluid #state_wrapper");
			
		},
		
		beforeLoad: function() {
			
			$('<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"></link>').appendTo("head");
			$('<meta name="viewport" content="width=device-width, initial-scale=1"/>').appendTo("head");
			
			// Create a print status and files link and tab
			$('<li id="print_link"><a href="#printer" data-toggle="tab"></a></li>').insertBefore("#tabs li:first-child");
			$('<div id="printer"><div class="row-fluid"></div></div>').addClass("tab-pane").insertBefore("#temp");

			// Manipulate DOM for iScroll before knockout binding kicks in
			$('<div id="scroll"></div>').insertBefore('.page-container');
			$('.page-container').appendTo("#scroll");
		
			// Destroy sliders
			$('#control input[type="number"]').attr('data-bind', '');
			
			// Move the settings option into the dropdown for more screen
			var tmp = $("#navbar_settings").clone().attr("id", "navbar_settings2");
			var tmp2 = tmp.find("#navbar_show_settings").attr("data-bind", "").attr("id", "");
			
			tmp.insertBefore("#login_dropdown_loggedin li:first-child");
			tmp2.click(function(e) {
				$("#navbar_settings").find("a").click();
			});
			
			// Clone the G-CODE viewer, hide the orginal and place it in the dropdown
			$("#gcode_link").clone().attr("id", "gcode_link2").insertBefore("#login_dropdown_loggedin li:first-child").click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				$("#gcode_link a").click();
			});
			$("#gcode_link").addClass("hidden_touch");
		}
	}
};
