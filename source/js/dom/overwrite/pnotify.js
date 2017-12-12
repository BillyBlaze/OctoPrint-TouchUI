TouchUI.prototype.DOM.overwrite.pnotify = function() {

	if(!this.settings.hasTouch) {
		var tmp = PNotify.prototype.options.stack;
		tmp.context = $('#scroll .page-container');
		PNotify.prototype.options.stack = tmp;
	}

}
