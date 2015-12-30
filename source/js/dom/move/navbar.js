TouchUI.prototype.DOM.move.navbar = {
	mainItems: ['#all_touchui_settings', '#navbar_plugin_navbartemp', '#navbar_login', /*'#navbar_systemmenu',*/ '.hidden_touch'],
	init: function() {

		$items = $("#navbar ul.nav > li:not("+this.DOM.move.navbar.mainItems+")");
		$items.each(function(ind, elm) {
			var $elm = $(elm);
			$elm.appendTo(this.DOM.create.dropdown.container);
			$elm.find('a').text($elm.text().trim());
		}.bind(this));

		// Move TouchUI to main dropdown
		$("#navbar_plugin_touchui").insertAfter("#navbar_settings");

		// Create and Move login form to main dropdown
		$('<li><ul id="youcanhazlogin"></ul></li>').insertAfter("#navbar_plugin_touchui");
		$('#navbar_login').appendTo('#youcanhazlogin').find('a.dropdown-toggle').text($('#youcanhazlogin').find('a.dropdown-toggle').text().trim());

		// Move the navbar temp plugin
		this.plugins.navbarTemp.call(this);

	}

}
