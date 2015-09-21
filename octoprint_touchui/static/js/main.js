window.TouchUI = window.TouchUI || {};
window.TouchUI.main = {
	init: function() {
		$("html").attr("id", "touch");
		this.cookies.set("TouchUI", "true");
	},
	
	knockout: {
		
		isReady: function(viewModels) {
			var self = this,
				terminalViewModel = viewModels[0],
				connectionViewModel = viewModels[1],
				settingsViewModel = viewModels[2];

			// Remove slimScroll from files list
			$('.gcode_files').slimScroll({destroy: true});
			$('.slimScrollDiv').slimScroll({destroy: true});

			// Remove drag files into website feature
			$(document).off("dragover");
			
			// Move the contents of the hidden accordions to the new print status and files tab
			$('#state_wrapper').appendTo("#printer .row-fluid");
			$('#files_wrapper').insertAfter("#printer .row-fluid #state_wrapper");
			
			// Watch the operational binder for visual online/offline
			var subscription = connectionViewModel.isOperational.subscribe(function(newOperationalState) {
				var printLink = $("#navbar_login");
				if( !newOperationalState ) {
					printLink.addClass("offline");
					$("#conn_link2").addClass("offline");
				} else {
					printLink.removeClass("offline");
					$("#conn_link2").removeClass("offline");
				}
			});
			
			// Refresh terminal scroll height
			terminalViewModel.displayedLines.subscribe(function() {
				window.TouchUI.scroll.iScrolls.terminal.refresh();
			});
			
			// Overwrite scrollToEnd function with iScroll functions
			terminalViewModel.scrollToEnd = function() {
				window.TouchUI.scroll.iScrolls.terminal.refresh();
				window.TouchUI.scroll.iScrolls.terminal.scrollTo(0, window.TouchUI.scroll.iScrolls.terminal.maxScrollY);
			};
			
			//Get currect version from settingsView and store them
			window.TouchUI.version = settingsViewModel.settings.plugins.touchui.version();
			
			var showing = window.TouchUI.version,
				update = false;
			if(update) {
				showing += " outdated, new version: 0.1.0";
			}
			
			// Update the content of the version
			$('head').append('<style>#term pre:after{ content: "v'+showing+'" !important; }</style>');
			
			// Add class with how many tab-items
			$(".tabbable").addClass("items-" + ($(".tabbable > .nav-tabs li[id]").length-1));
			
			//Copy feed rate into new div and grab flow rate
			var tmp = $('<div class="jog-panel"></div>').appendTo('#control');

			$('#control > .jog-panel:nth-child(1) > button:last-child').appendTo(tmp);
			$('#control > .jog-panel:nth-child(1) > [type="number"]:last-child').appendTo(tmp);
			$('#control > .jog-panel:nth-child(1) > .slider:last-child').appendTo(tmp);
			
			$('#control > .jog-panel:nth-child(2) > div > button:last-child').appendTo(tmp);
			$('#control > .jog-panel:nth-child(2) > div > [type="number"]:last-child').appendTo(tmp);
			$('#control > .jog-panel:nth-child(2) > div > .slider:last-child').appendTo(tmp);
			
			// Redo scroll-to-end
			$("#term .terminal small.pull-right").html('<a href="#"><i class="fa fa-angle-double-down"></i></a>').on("click", function() {
				terminalViewModel.scrollToEnd();
				return false;
			});
			
			// Overwrite orginal helper, add one step and call the orginal function
			var showOfflineOverlay = window.showOfflineOverlay;
			window.showOfflineOverlay = function(title, message, reconnectCallback) {
				window.TouchUI.scroll.iScrolls.body.scrollTo(0, 0, 500);
				showOfflineOverlay.call(this, title, message, reconnectCallback);
			};
			
			// Overwrite orginal helper, add one step and call the orginal function
			var showConfirmationDialog = window.showConfirmationDialog;
			window.showConfirmationDialog = function(message, onacknowledge) {
				window.TouchUI.scroll.iScrolls.body.scrollTo(0, 0, 500);
				showConfirmationDialog.call(this, message, onacknowledge);
			};
			
			$("#reloadui_overlay").on("show", function() {
				window.TouchUI.scroll.iScrolls.body.scrollTo(0, 0, 500);
			});
		},
		
		beforeLoad: function() {
			
			// Inject newer fontawesome
			$('<link href="/static/webassets/fonts/fontawesome.css" rel="stylesheet"></link>').appendTo("head");
			$('<meta name="viewport" content="width=device-width, initial-scale=1"/>').appendTo("head");
			
			// Create a print status and files link and tab
			$('<li id="print_link"><a href="#printer" data-toggle="tab"></a></li>').insertBefore("#tabs li:first-child");
			$('<div id="printer"><div class="row-fluid"></div></div>').addClass("tab-pane").insertBefore("#temp");

			// Manipulate DOM for iScroll before knockout binding kicks in
			$('<div id="scroll"></div>').insertBefore('.page-container');
			$('.page-container').appendTo("#scroll");
			
			// Clone the G-CODE viewer, hide the orginal and place it in the dropdown
			$("#gcode_link").clone().attr("id", "gcode_link2").insertAfter($('#login_dropdown_loggedin [href="#connection_dialog"]').parent()).click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				$("#gcode_link a").click();
			});
			$("#gcode_link").addClass("hidden_touch");
			
			// Move the settings option into the dropdown for more screen
			var tmp = $("#navbar_settings").clone().attr("id", "navbar_settings2")
			var tmp2 = tmp.find("#navbar_show_settings").attr("data-bind", "").attr("id", "");
			
			tmp.insertAfter($('#conn_link2'));
			tmp2.click(function(e) {
				$("#navbar_settings").find("a").click();
			});
			
			$("#navbar_settings2 a").html($("#navbar_settings2 a").text().trim());
			
			//Add hr after the G-CODE viewer
			$('<li class="divider"></li>').insertBefore("#navbar_settings2");
		}
	},
	
	cookies: {
		
		get: function(key) {
			var name = key + "=";
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
			document.cookie = key + "=" + value + "; " + expires;
		}
		
	}
};
