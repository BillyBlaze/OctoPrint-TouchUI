TouchUI.prototype.scroll.blockEvents = {
	className: "no-pointer",

	scrollStart: function($elm, iScrollInstance) {
		$elm.addClass(this.scroll.blockEvents.className);
	},

	scrollEnd: function($elm, iScrollInstance) {
		$elm.removeClass(this.scroll.blockEvents.className);
		this.scroll.refresh(iScrollInstance);
	}

}
