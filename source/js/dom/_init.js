TouchUI.prototype.DOM.init = function() {

	// Create new tab with printer status and make it active
	this.DOM.create.printer.init(this.DOM.create.tabbar);
	this.DOM.create.printer.menu.$elm.find('a').trigger("click");

	// Create a new persistent dropdown
	this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

	// Add a webcam tab if it's defined
	if ($("#webcam_container").length > 0) {
		this.DOM.create.webcam.init(this.DOM.create.tabbar);
	}

	// Move all other items from tabbar into dropdown
	this.DOM.move.navbar.init.call(this);
	this.DOM.move.tabbar.init.call(this);
	this.DOM.move.afterTabAndNav.call(this);
	this.DOM.move.overlays.init.call(this);
	this.DOM.move.terminal.init.call(this);

	// Move connection sidebar into a new modal
	this.DOM.move.connection.init(this.DOM.create.tabbar);

	// Manipulate controls div
	this.DOM.move.controls.init();

	// Disable these bootstrap/jquery plugins
	this.DOM.overwrite.tabdrop.call(this);
	this.DOM.overwrite.modal.call(this);
	this.DOM.overwrite.pnotify.call(this);

	// Add class with how many tab-items
	$("#tabs, #navbar").addClass("items-" + $("#tabs li:not(.hidden_touch)").length);

	// Remove active class when clicking on a tab in the tabbar
	$('#tabs [data-toggle=tab]').on("click", function() {
		$("#all_touchui_settings").removeClass("item_active");
	});

	// If touch emulator is enabled, then disable dragging of a menu item for scrolling
	if(!this.settings.hasTouch) {
		$("#navbar ul.nav > li a").on("dragstart drop", function(e) {
			return false;
		});
	}
}
