TouchUI.prototype.core.boot = function() {

	// This should always start TouchUI
	if(
		document.location.hash === "#touch" ||
		document.location.href.indexOf("?touch") > 0 ||
		this.DOM.storage.get("active") ||
		this.settings.isChromiumArm
	) {

		return true;

	} else if(
		this.DOM.storage.get("active") !== false
	) {

		if($(window).width() < 980 && this.settings.canBoot.resolution) {
			return true;
		}

		if(this.settings.hasTouch && this.settings.canBoot.touch) {
			return true;
		}

	}

	return false;

}
