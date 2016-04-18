TouchUI.prototype.DOM.pool = {
	timer: null,
	callTree: [],
	duration: 100,

	// For performance we will add some heavy functions into a que
	// We will execute them later and not during this runtime (i.e. iScroll refresh after DOMloading)
	add: function(fn, scope) {
		if(!this.timer) {
			this.timer = setTimeout(this.execute.bind(this), this.duration);
		}

		this.callTree.push([fn, scope]);
	},

	execute: function() {
		_.each(this.callTree, function(fn) {
			fn[0].call(fn[1]);
		});

		this.callTree = [];
		this.timer = null;
	}

}
