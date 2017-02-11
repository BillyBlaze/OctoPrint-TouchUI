TouchUI.prototype.plugins.psuControl = function() {

	// Manually move navbar temp (hard move)
	if( $("#navbar_plugin_psucontrol").length > 0 ) {
		var navBarTmp = $("#navbar_plugin_psucontrol").appendTo(this.DOM.create.dropdown.container);
	}

}
