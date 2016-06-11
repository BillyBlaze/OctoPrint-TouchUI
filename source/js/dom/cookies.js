TouchUI.prototype.DOM.cookies = {

	get: function(key, isPlain) {
		var name = (isPlain) ? key + "=" : "TouchUI." + key + "=";
		var ca = document.cookie.split(';');
		var tmp;
		for(var i=0; i<ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf(name) == 0) tmp = c.substring(name.length,c.length);
			return (isPlain) ? tmp : $.parseJSON(tmp);
			
		}
		return undefined;
	},

	set: function(key, value, isPlain) {
		key = (isPlain) ? key + "=" : "TouchUI." + key + "=";
		var d = new Date();
		d.setTime(d.getTime()+(360*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = key + value + "; " + expires;
	},

	toggleBoolean: function(key, isPlain) {
		var value = $.parseJSON(this.get(key, isPlain) || "false");

		if(value === true) {
			this.set(key, "false", isPlain);
		} else {
			this.set(key, "true", isPlain);
		}

		return !value;

	}

}
