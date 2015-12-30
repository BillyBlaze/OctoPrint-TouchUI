TouchUI.prototype.scroll.blockEvents = {
	className: "no-pointer",

	scrollStart: function($elm, iScrollInstance) {
		$elm.addClass(this.className);
	},

	scrollEnd: function($elm, iScrollInstance) {
		$elm.removeClass(this.className);
		iScrollInstance.refresh();
	}

}
