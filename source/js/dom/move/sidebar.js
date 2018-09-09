TouchUI.prototype.DOM.move.sidebar = {

	items: ".octoprint-container > .row > .accordion > div",

	menu: {
		cloneTo: "#tabs"
	},

	container: {
		cloneTo: "#temp"
	},

	doNotMove: [
		'#sidebar_plugin_printer_safety_check_wrapper',
		'#connection_wrapper'
	],

	init: function() {
		var tabbar = this.DOM.create.tabbar;
		$(this.DOM.move.sidebar.items + ':not(' + this.DOM.move.sidebar.doNotMove + ')').each(function(ind, elm) {
			var id = $(elm).attr('id');
			
			tabbar.createItem(id + "_link", id, "tab")
				.appendTo(this.menu.cloneTo)
				.find('[data-toggle="tab"]')
				.text($(elm).find('.accordion-toggle').text().trim());

			$('<div id="' + id + '" class="tab-pane touchui touchui-accordion"><div class="row-fluid"></div></div>')
				.insertBefore(this.container.cloneTo)
				.children().get(0)
				.prepend(elm);

		}.bind(this.DOM.move.sidebar));

	}

}
