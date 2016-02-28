TouchUI.prototype.core.boot = function() {

	// This should always start TouchUI
	if(
		document.location.hash === "#touch" ||
		document.location.href.indexOf("?touch") > 0 ||
		this.DOM.storage.get("active")
	) {

		return true;

	} else if(
		this.canLoadAutomatically &&
		this.DOM.storage.get("active") !== false
	) {

		if($(window).width() < 980) {
			return true;
		}

		if(this.hasTouch) {
			return true;
		}

	}

	return false;

}
