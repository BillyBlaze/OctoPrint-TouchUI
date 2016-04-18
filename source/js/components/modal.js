TouchUI.prototype.components.modal = {

	init: function() {

		if($("#settings_dialog_menu").length > 0) {
			this.components.modal.dropdown.create.call(this, "#settings_dialog_menu ul.nav", "special-dropdown-uni", "#settings_dialog_label");
		}
		if($("#usersettings_dialog ul.nav").length > 0) {
			this.components.modal.dropdown.create.call(this, "#usersettings_dialog ul.nav", "special-dropdown-uni-2", "#usersettings_dialog h3");
		}
	},

	dropdown: {
		create: function(cloneId, newId, appendTo) {
			var self = this;
			var $appendTo = $(appendTo);
			var $cloneId = $(cloneId);

			$appendTo
				.text($appendTo.text().replace("OctoPrint", "").trim())

			var $div = $('<div/>')
				.addClass('dropdown')
				.appendTo($appendTo);

			$cloneId
				.attr("id", newId)
				.addClass('dropdown-menu')
				.appendTo($div);

			// Create a label that is clickable
			var $settingsLabel = $('<a class="dropdown-toggle" href="#" data-toggle="dropdown"></a>')
				.insertBefore($cloneId)
				.text($("#"+newId+" .active").text().trim());

		}
	}
}
