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
							$(document).off(event).trigger("dropdown-is-closed"); // Trigger event for enabling scrolling
							
							$('.show-dropdown').remove();
							$('[href="'+href+'"]').click();
							settingsLabel.text($('[href="'+href+'"]').text());
						}

					});
					
					// Trigger event for disabling scrolling
					$(document).trigger("dropdown-is-open", [ elm[0] ]);
				});
		}
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
		
	}
	
};