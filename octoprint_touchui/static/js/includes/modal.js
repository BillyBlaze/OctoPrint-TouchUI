!function ($) {

	$.fn.TouchUI.modal = {
		init: function() {
			this.modal.dropdown.create("#settings_dialog_menu", "special-dropdown-uni", "#settings_dialog_label");
			this.modal.dropdown.create("#usersettings_dialog ul.nav", "special-dropdown-uni-2", "#usersettings_dialog h3");
		},
		dropdown: {
			create: function(cloneId, newId, appendTo) {
				// Remove unwanted whitespaces
				$(appendTo).text($(appendTo).text().trim());

				// Create a label that is clickable
				var settingsLabel = $("<span></span>")
					.addClass("hidden")
					.attr("id", newId)
					.appendTo(appendTo)
					.text($(cloneId+" .active").text().trim())
					.on("click", function(e) {

						// Stop if we clicked on the dropdown and stop the dropdown from regenerating more then once
						if(e.target !== this || (e.target === this && $(".show-dropdown").length > 0)) {
							return;
						}

						// Clone the main settings menu
						var elm = $(cloneId)
							.clone()
							.attr("id", "")
							.appendTo(this)
							.addClass("show-dropdown");

						// Add click binder to close down the dropdown
						$(document).on("click", function(event) {

							if(
								$(event.target).closest('[data-toggle="tab"]').length > 0 || //Check if we clicked on a tab-link
								$(event.target).closest("#"+newId).length === 0 //Check if we clicked outside the dropdown
							) {
								var href = settingsLabel.find(".active").find('[data-toggle="tab"]').attr("href");
								$(document).off(event).trigger("dropdown-closed.touchui"); // Trigger event for enabling scrolling

								$('.show-dropdown').remove();
								$('[href="'+href+'"]').click();
								settingsLabel.text($('[href="'+href+'"]').text());

								setTimeout(function() {
									self.scroll.iScrolls.body.refresh();
								}, 0);
							}

						});

						// Trigger event for disabling scrolling
						$(document).trigger("dropdown-open.touchui", elm[0]);
					});
			}
		}
	};

}(window.jQuery);
