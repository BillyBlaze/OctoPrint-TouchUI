// Try if we can set an item, KWEB3 disallow any use of localstorage,
// but for some reason does tell us the localStorage API is avalaible.
// So when we're getting the ExeeedStorage error, ignore and use cookies.
if (TouchUI.prototype.hasLocalStorage) {
	try {
		window.localStorage.setItem("TouchUI-canWeHazStorage", true);
		TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.localstorage;
		window.localStorage.removeItem("TouchUI-canWeHazStorage");
	} catch(err) {
		console.info("Failback to cookies.")
		TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.cookies;
	}
} else {
	TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.cookies;
}

// TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.cookies;
TouchUI.prototype.DOM.storage.migration = (TouchUI.prototype.DOM.storage === TouchUI.prototype.DOM.cookies) ? _.noop : function() {

	if (this.hasLocalStorage) {
		if (document.cookie.indexOf("TouchUI.") !== -1) {
			console.info("TouchUI cookies migration.");

			var name = "TouchUI.";
			var ca = document.cookie.split(';');
			for (var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) {
					var string = c.substring(name.length,c.length);
					string = string.split("=");
					var value = $.parseJSON(string[1]);

					console.info("Saving cookie", string[0], "with value", value, "to localstorage.");
					this.DOM.storage.set(string[0], value);

					console.info("Removing cookie", string[0]);
					document.cookie = "TouchUI." + string[0] + "=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
				}
			}
		}
	}

}
