window.TouchUI = window.TouchUI || {};
		
window.TouchUI.main = {
	init: function() {
		$("html").attr("id", "touch");
		this.cookies.set("TouchUI", "true");
		
		window.TouchUI.isTouch = "ontouchstart" in window || "onmsgesturechange" in window;
		
		$.fn.tabdrop = function() {};
		$.fn.tabdrop.prototype = { constructor: $.fn.tabdrop };
		$.fn.tabdrop.Constructor = $.fn.tabdrop;
	},
	
	knockout: {
		
		beforeLoad: function() {
			
			// Inject newer fontawesome
			$('<link href="/static/webassets/fonts/fontawesome.css" rel="stylesheet"></link>').appendTo("head");
			$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1"/>').appendTo("head");
			
			window.TouchUI.DOM.create.init();
			window.TouchUI.scroll.beforeLoad();
			
		},
		
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

			// Watch the operational binder for visual online/offline
			var subscription = connectionViewModel.isOperational.subscribe(function(newOperationalState) {
				var printLink = $("#navbar_login");
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
				if (!window.TouchUI.isTouch) {
					terminalViewModel.scrollToEnd();
					return false;
				}
			});

			if( !window.TouchUI.isTouch ) {
				window.TouchUI.scroll.terminal.knockoutOverwrite.call(window.TouchUI.scroll.terminal, terminalViewModel);
			}

			window.TouchUI.DOM.move.init();
			window.TouchUI.main.version.init(settingsViewModel);

			// Add class with how many tab-items
			$("#tabs").addClass("items-" + $("#tabs li:not(.hidden_touch)").length);

		}
	},
	
	version: {
		
		init: function(settingsViewModel) {

			//Get currect version from settingsView and store them
			window.TouchUI.version = settingsViewModel.settings.plugins.touchui.version();
			
			var showing = window.TouchUI.version,
				update = false;
				
			//TODO: check for update
			if(update) {
				showing += " outdated, new version: 0.1.0";
			}
			
			// Update the content of the version
			$('head').append('<style id="touch_updates_css">#term pre:after{ content: "v'+showing+'" !important; }</style>');
			
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
