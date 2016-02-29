TouchUI.prototype.DOM.move.connection = {
	$container: null,
	containerId: "connection_dialog",
	$cloneContainer: $("#usersettings_dialog"),
	$cloneModal: $("#connection_wrapper"),
	cloneTo: "#all_touchui_settings > ul",

	init: function( tabbar ) {
		var text = this.$cloneModal.find(".accordion-heading").text().trim();

		// Clone usersettings modal
		this.$container = this.$cloneContainer.clone().attr("id", this.containerId).insertAfter(this.$cloneContainer);
		this.$containerBody = this.$container.find(".modal-body");

		// Remove all html from clone
		this.$containerBody.html("");

		// Append tab contents to modal
		this.$cloneModal.appendTo(this.$containerBody);

		// Set modal header to accordion header
		this.$container.find(".modal-header h3").text(text);

		// Create a link in the dropdown
		this.$menuItem = tabbar.createItem("conn_link2", this.containerId, "modal", text)
			.attr("data-bind", "visible: loginState.isAdmin")
			.prependTo(this.cloneTo);
	}
}
