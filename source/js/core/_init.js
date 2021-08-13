TouchUI.prototype.core.init = function() {

	// Migrate old cookies into localstorage
	this.DOM.storage.migration.call(this);

	// Bootup TouchUI if Touch, Small resolution or storage say's so
	if (this.core.boot.call(this)) {

		// Send Touchscreen loading status
		if (window.top.postMessage) {
			window.top.postMessage("loading", "*");
		}

		// Attach id for TouchUI styling
		$("html").attr("id", this.settings.id);

		// Force mobile browser to set the window size to their format
		$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
		$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
		$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");

		this.isActive(true);

		// Do not set active cookie if hash "#touch-temp" is used
		// That way you can boot into TouchUI for a single session
		if (document.location.hash !== "#touch-temp") {
			// Enforce active cookie
			this.DOM.storage.set("active", true);
		}
		
		var isTouchDevice = this.settings.isEpiphanyOrKweb || this.settings.isChromiumArm || this.settings.hasBootloader;

		// Create keyboard cookie if not existing
		if (this.DOM.storage.get("keyboardActive") === undefined) {
			if (!this.settings.hasTouch || isTouchDevice) {
				this.DOM.storage.set("keyboardActive", true);
			} else {
				this.DOM.storage.set("keyboardActive", false);
			}
		}

		// Create hide navbar on click if not existing
		if (this.DOM.storage.get("hideNavbarActive") === undefined) {
			this.DOM.storage.set("hideNavbarActive", false);
		}

		// Treat KWEB3 as a special Touchscreen mode or enabled by cookie
		if (
			this.DOM.storage.get("touchscreenActive") ||
			(
				isTouchDevice &&
				this.DOM.storage.get("touchscreenActive") === undefined
			)
		) {
			this.components.touchscreen.init.call(this);
		}

		// If TouchUI has been started through bootloader then initialize the process during reloads
		if (this.settings.hasBootloader && window.top.postMessage) {
			window.onbeforeunload = function() {
				window.top.postMessage("reset", "*");
			};
		}

		// Get state of cookies and store them in KO
		this.components.keyboard.isActive(this.DOM.storage.get("keyboardActive"));
		this.animate.isHidebarActive(this.DOM.storage.get("hideNavbarActive"));
		this.settings.isFullscreen($(document).fullScreen() !== false);
	}

}
