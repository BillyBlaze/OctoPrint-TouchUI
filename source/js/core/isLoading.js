TouchUI.prototype.core.isLoading = function() {
console.log(this);
	if( this.core.checkAutoLoad.call(this) ) {
		$("html").attr("id", this.id);

		// Force mobile browser to set the window size to their format
		$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1, user-scalable=no, minimal-ui">').appendTo("head");
		$('<meta name="apple-mobile-web-app-capable" content="yes">').appendTo("head");
		$('<meta name="mobile-web-app-capable" content="yes">').appendTo("head");
		$('<span></span>').prependTo("#terminal-output");

		this.isActive = true;

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
			this.fullscreen.ask.call(this);
		} else {
			//Cookie say user wants fullscreen, ask it!
			if(this.DOM.cookies.get("fullscreen") === "true") {
				this.fullscreen.ask.call(this);
			}
		}

		// Get state of cookies
		this.components.keyboard.isActive = (this.DOM.cookies.get("keyboardActive") === "true");
		this.animate.isHidebarActive = (this.DOM.cookies.get("hideNavbarActive") === "true");
		this.isFullscreen = (this.DOM.cookies.get("fullscreen") === "true");

		// Create new tab with printer status and make it active
		this.DOM.create.printer.init( this.DOM.create.tabbar );
		this.DOM.create.printer.menu.$elm.find('a').trigger("click");

		// Create a new persistent dropdown
		this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

		// Move all other items from tabbar into dropdown
		this.DOM.move.tabbar.init.call( this );
		this.DOM.move.navbar.init.call( this );
		this.DOM.move.afterTabAndNav.call( this );
		this.DOM.move.overlays.init.call( this );
	}
}
