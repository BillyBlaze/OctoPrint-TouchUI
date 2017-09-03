TouchUI.prototype.scroll.overlay = {

	mainItems: ['#offline_overlay', '#reloadui_overlay'],
	init: function() {
		var self = this;

		self.scroll.iScrolls.overlay = [];

		var $items = $(this.scroll.overlay.mainItems);
		$items.each(function(ind, elm) {
			var child = $(elm).children("#" + $(elm).attr("id") + "_wrapper");
			var div = $('<div></div>').prependTo(elm);
			child.appendTo(div);

			$(elm).addClass("iscroll");

			self.scroll.iScrolls.overlay[ind] = new IScroll(elm, self.scroll.defaults.iScroll);
		});

	},

	refresh: function() {
		var self = this;

		setTimeout(function() {
			$.each(self.scroll.iScrolls.overlay, function(ind) {
				self.scroll.iScrolls.overlay[ind].refresh();
			});
		}, 0);

	}

}
