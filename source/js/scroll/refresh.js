TouchUI.prototype.scroll.refresh = function(iScrollInstance) {

	// Refresh the scrollview, but for performance..
	// we first check if it's needed at all
	if(iScrollInstance) {
		if(iScrollInstance.scrollerHeight !== $(iScrollInstance.scroller).innerHeight()) {
			iScrollInstance.refresh();
		}
	}

}
