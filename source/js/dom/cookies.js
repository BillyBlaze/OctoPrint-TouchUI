TouchUI.prototype.DOM.cookies = {

	get: function(key) {
		var name = "TouchUI." + key + "=";
		var ca = document.cookie.split(';');
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
		}
		return undefined;
	},

	set: function(key, value) {
		var d = new Date();
		d.setTime(d.getTime()+(360*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = "TouchUI." + key + "=" + value + "; " + expires;
	},

	toggleBoolean: function(key) {
		var value = $.parseJSON(this.get(key) || "false");

		if(value === true) {
			this.set(key, "false");
		} else {
			this.set(key, "true");
		}

		return !value;

	}

}
