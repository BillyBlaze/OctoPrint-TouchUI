TouchUI.prototype.DOM.localstorage = {
	store: JSON.parse(localStorage["TouchUI"] || "{}"),

	get: function (key) {
		return this.store[key];
	},

	set: function (key, value) {
		this.store[key] = value;
		localStorage["TouchUI"] = JSON.stringify(this.store);
		return this.store[key];
	},

	toggleBoolean: function (key) {
		var value = this.store[key] || false;

		if(value === true) {
			this.set(key, false);
		} else {
			this.set(key, true);
		}

		return !value;

	}

}
