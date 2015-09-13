$(function() {
	function touchUIViewModel(parameters) {
		var self = this;
		
		$("body").attr("id", "touch");
		$("<link></link>").appendTo("head").attr("href", "https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css").attr("rel", "stylesheet");
		
		self.toggleTouchUI = function() {
			
		};
		
		$(window).resize(function() {
			var plot = $("#temperature-graph").data("plot");
			
			plot.resize();
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
		
	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["controlViewModel", "connectionViewModel"],
		"#settings_plugin_touch_ui"
	]);
});