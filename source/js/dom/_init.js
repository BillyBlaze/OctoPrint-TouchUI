TouchUI.prototype.DOM.init = function() {

	this.DOM.move.connection.init( this.DOM.create.tabbar );
	this.DOM.move.controls.init();

	if ($("#webcam_container").length > 0) {
		this.DOM.create.webcam.init( this.DOM.create.tabbar );
	}

	// Add class with how many tab-items
	$("#tabs, #navbar").addClass("items-" + $("#tabs li:not(.hidden_touch)").length);

	$("#tabs li a").on("click", function() {
		$("#all_touchui_settings").removeClass("item_active");
	});

}
