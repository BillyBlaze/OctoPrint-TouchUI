TouchUI.prototype.DOM.init = function() {

	// Create new tab with printer status and make it active
	this.DOM.create.printer.init( this.DOM.create.tabbar );
	this.DOM.create.printer.menu.$elm.find('a').trigger("click");

	// Create a new persistent dropdown
	this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

	// Move all other items from tabbar into dropdown
	this.DOM.move.tabbar.init.call( this );
	this.DOM.move.navbar.init.call( this );
	this.DOM.move.afterTabAndNav.call( this );
	this.DOM.move.overlays.init.call( this );

	// Move connection sidebar into a new modal
	this.DOM.move.connection.init( this.DOM.create.tabbar );

	// Manipulate controls div
	this.DOM.move.controls.init();

	// Add a webcam tab if it's defined
	if ($("#webcam_container").length > 0) {
		this.DOM.create.webcam.init( this.DOM.create.tabbar );
	}

}
