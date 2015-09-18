window.TouchUI = window.TouchUI || {};
window.TouchUI.modal = {
	init: function() {
		this.dropdown.init.call(this);
	},
	dropdown: {
		init: function() {

			// Create a label that is clickable
			var settingsLabel = $("<span></span>")
				.addClass("hidden")
				.attr("id", "special-dropdown-uni")
				.appendTo("#settings_dialog_label")
				.text($("#settings_dialog_menu .active")
				.text()
				.trim())
				.on("click", function(e) {
					
					// Stop if we clicked on the dropdown and stop the dropdown from regenerating more then once
					if(e.target !== this || (e.target === this && $(".show-dropdown").length > 0)) {
						return;
					}
					
					// Clone the main settings menu
					var elm = $("#settings_dialog_menu")
						.clone()
						.attr("id", "")
						.appendTo(this)
						.addClass("show-dropdown");
						
					// Add click binder to close down the dropdown
					$(document).on("click", function(event) {
						
						if(
							$(event.target).closest('[data-toggle="tab"]').length > 0 || //Check if we clicked on a tab-link
							$(event.target).closest("#special-dropdown-uni").length === 0 //Check if we clicked outside the dropdown
						) {
							var href = settingsLabel.find(".active").find('[data-toggle="tab"]').attr("href");
							$(document).off(event).trigger("dropdown-is-closed");
							
							$('.show-dropdown').remove();
							$('[href="'+href+'"]').click();
							settingsLabel.text($('[href="'+href+'"]').text());
						}
						
					});
					$(document).trigger("dropdown-is-open", [ elm[0] ]);
				});
		}
	}
};