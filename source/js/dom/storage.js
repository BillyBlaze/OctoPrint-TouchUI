// Since I messed up by releasing start_kweb3.xinit without disabling private
// mode, we now need to check if we can store anything at all in localstorage
// the missing -P will prevent any localstorage
if (TouchUI.prototype.settings.hasLocalStorage) {
	try {
		localStorage["TouchUIcanWeHazStorage"] = "true";
		TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.localstorage;
		delete localStorage["TouchUIcanWeHazStorage"];
	} catch(err) {

		// TODO: remove this is future
		if(TouchUI.prototype.settings.isEpiphanyOrKweb) {
			$(function() {
				new PNotify({
					type: 'error',
					title: "Private Mode detection:",
					text: "Edit the startup file 'start_kweb3.xinit' in '~/OctoPrint-TouchUI-autostart/' "+
						"and add the parameter 'P' after the dash. \n\n" +
						"For more information see the v0.3.3 release notes.",
					hide: false
				});
			});
		}

		console.info("Localstorage defined but failback to cookies due to errors.");
		TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.cookies;
	}
} else {
	TouchUI.prototype.DOM.storage = TouchUI.prototype.DOM.cookies;
}

TouchUI.prototype.DOM.storage.migration = (TouchUI.prototype.DOM.storage === TouchUI.prototype.DOM.localstorage) ? function migration() {

	if (this.settings.hasLocalStorage) {
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

} : _.noop;


if (localStorage) {
	if (localStorage["remember_token"] && !TouchUI.prototype.DOM.cookies.get("remember_token", true)) {
		TouchUI.prototype.DOM.cookies.set("remember_token", localStorage["remember_token"], true)
	}
}
