TouchUI.prototype.DOM.create.dropdown = {

	menuItem: {
		cloneTo: $('#navbar ul.nav')
	},
	container: null,

	init: function() {

		this.menuItem.menu = $('<!-- ko allowBindings: false -->' +
			'<li id="all_touchui_settings" class="dropdown">' +
				'<a href="#" class="dropdown-toggle" data-toggle="dropdown">' +
					$('navbar_show_settings').text() +
				'</a>' +
			'</li>' +
			'<!-- /ko -->').prependTo(this.menuItem.cloneTo);

		this.container = $('<div class="dropdown-menu"></div>').appendTo(this.menuItem.menu);
		this.container = $('<ul></ul>').appendTo(this.container);
	}

}
