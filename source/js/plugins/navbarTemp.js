TouchUI.prototype.plugins.navbarTemp = function() {

	// Manually move navbar temp (hard move)
	if( $("#navbar_plugin_navbartemp").length > 0 ) {
		var navBarTmp = $("#navbar_plugin_navbartemp").appendTo(this.DOM.create.dropdown.container);
		$('<li class="divider"></li>').insertBefore(navBarTmp);
		$("<!-- ko allowBindings: false -->").insertBefore(navBarTmp);
		$("<!-- /ko -->").insertAfter(navBarTmp);
	}

}
