TouchUI.prototype.DOM.overwrite.pnotify = function() {

	// Force the webcam tab to load the webcam feed that original is located on the controls tab
	if(!this.settings.hasTouch) {
		var tmp = PNotify.prototype.options.stack;
		tmp.context = $('#scroll .page-container');
		PNotify.prototype.options.stack = tmp;
	}

}
