TouchUI.prototype.core.init = function() {

	if( this.core.checkAutoLoad.call(this) ) {
		this.core.exception(); //enable errors

		// If KWEB3, don't let the diver tell us it's has a Touch API
		this.isTouch = (window.navigator.userAgent.indexOf("AppleWebKit") !== -1 && window.navigator.userAgent.indexOf("ARM Mac OS X") !== -1) ? false : this.isTouch;

		$("html").attr("id", this.id);

		// Force mobile browser to set the window size to their format
		$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
		$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
		$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");

		this.isActive(true);

		// Enforce active cookie
		this.DOM.cookies.set("active", "true");

		// Create keyboard cookie if not existing
		if(this.DOM.cookies.get("keyboardActive") === undefined) {
			if(!this.isTouch) {
				this.DOM.cookies.set("keyboardActive", "true");
			} else {
				this.DOM.cookies.set("keyboardActive", "false");
			}
		}

		// Create hide navbar on click if not existing
		if(this.DOM.cookies.get("hideNavbarActive") === undefined) {
			this.DOM.cookies.set("hideNavbarActive", "false");
		}

		// Create fullscreen cookie if not existing and trigger pNotification
		if(this.DOM.cookies.get("fullscreen") === undefined) {
			this.DOM.cookies.set("fullscreen", "false");
			this.components.fullscreen.ask.call(this);
		} else {
			//Cookie say user wants fullscreen, ask it!
			if(this.DOM.cookies.get("fullscreen") === "true") {
				this.components.fullscreen.ask.call(this);
			}
		}

		// Get state of cookies and store them in KO
		this.components.keyboard.isActive(this.DOM.cookies.get("keyboardActive") === "true");
		this.animate.isHidebarActive(this.DOM.cookies.get("hideNavbarActive") === "true");
		this.isFullscreen(this.DOM.cookies.get("fullscreen") === "true");

	}

}
