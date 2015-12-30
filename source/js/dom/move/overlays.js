TouchUI.prototype.DOM.move.overlays = {

	mainItems: ['#offline_overlay', '#reloadui_overlay', '#drop_overlay'],
	init: function() {

		$(this.DOM.move.overlays.mainItems).each(function(ind, elm) {
			var $elm = $(elm);
			$elm.appendTo('body');
		}.bind(this));

	}

}
