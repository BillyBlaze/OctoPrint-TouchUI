$(function() {
	function touchUIViewModel(parameters) {
		var self = this;
		
		self.toggleTouchUI = function() {
			
		};
		
/*		$(window).resize(function() {
			var plot = $("#temperature-graph").data("plot");
			
			plot.resize();
		});*/
		

		$("html").attr("id", "touch");
		$("<link></link>").appendTo("head").attr("href", "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css").attr("rel", "stylesheet");
		
		
		var tmp = $("#navbar_settings").clone().attr("id", "navbar_settings2");
		var tmp2 = tmp.find("#navbar_show_settings").attr("data-bind", "").attr("id", "");
		
		tmp.insertBefore("#login_dropdown_loggedin li:first-child");
		tmp2.click(function(e) {
			$("#navbar_settings").find("a").click();
		});

		var settingsLabel = $("<span></span>").addClass("hidden").attr("id", "special-dropdown-uni").appendTo("#settings_dialog_label").text($("#settings_dialog_menu .active").text().trim()).on("click", function(e) {
			if(e.target !== this || (e.target === this && $(".show-dropdown").length > 0)) {
				return;
			}
			
			$("#settings_dialog_menu").clone().attr("id", "").appendTo(this).addClass("show-dropdown");
			$(document).on("click", function(event) {
				
				if(
					$(event.target).closest('[data-toggle="tab"]').length > 0 || //Check if we clicked on a tab-link
					$(event.target).closest("#special-dropdown-uni").length === 0 //Check if we clicked outside the dropdown
				) {
					var href = settingsLabel.find(".active").find('[data-toggle="tab"]').attr("href");
					$(document).off(event);
					
					$('.show-dropdown').remove();
					$('[href="'+href+'"]').click();
					settingsLabel.text($('[href="'+href+'"]').text());
				}
				
			});
		});
		
		$("#gcode_link").clone().attr("id", "gcode_link2").insertBefore("#login_dropdown_loggedin li:first-child").click(function(e) {
			e.preventDefault();
			e.stopPropagation();
			
			$("#gcode_link a").click();
		});
		$("#gcode_link").addClass("hidden_touch");
		
		$('<li id="print_link"><a href="#printer" data-toggle="tab"></a></li>').insertBefore("#tabs li:first-child");
		$('<div id="printer"><div class="row-fluid"></div></div>').addClass("tab-pane").insertBefore("#temp");
		$('#state_wrapper').appendTo("#printer .row-fluid");
		$('#files_wrapper').insertAfter("#printer .row-fluid #state_wrapper");
		
		
		/*$("#terminal-output").html(	"▄▄▄█████▓ ▒█████   █    ██  ▄████▄   ██░ ██  █    ██  ██▓\n" +
									"▓  ██▒ ▓▒▒██▒  ██▒ ██  ▓██▒▒██▀ ▀█  ▓██░ ██▒ ██  ▓██▒▓██▒\n"+
									"▒ ▓██░ ▒░▒██░  ██▒▓██  ▒██░▒▓█    ▄ ▒██▀▀██░▓██  ▒██░▒██▒\n"+
									"░ ▓██▓ ░ ▒██   ██░▓▓█  ░██░▒▓▓▄ ▄██▒░▓█ ░██ ▓▓█  ░██░░██░\n"+
									"  ▒██▒ ░ ░ ████▓▒░▒▒█████▓ ▒ ▓███▀ ░░▓█▒░██▓▒▒█████▓ ░██░\n"+
									"  ▒ ░░   ░ ▒░▒░▒░ ░▒▓▒ ▒ ▒ ░ ░▒ ▒  ░ ▒ ░░▒░▒░▒▓▒ ▒ ▒ ░▓  \n"+
									"    ░      ░ ▒ ▒░ ░░▒░ ░ ░   ░  ▒    ▒ ░▒░ ░░░▒░ ░ ░  ▒ ░\n"+
									"  ░      ░ ░ ░ ▒   ░░░ ░ ░ ░         ░  ░░ ░ ░░░ ░ ░  ▒ ░\n"+
									"             ░ ░     ░     ░ ░       ░  ░  ░   ░      ░  \n"+
									"                           ░                             \n\n");*/
	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["controlViewModel", "connectionViewModel"],
		"#settings_plugin_touch_ui"
	]);
});