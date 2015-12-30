TouchUI.prototype.scroll.beforeLoad = function() {

	// Manipulate DOM for iScroll before knockout binding kicks in
	if (!this.isTouch) {
		$('<div id="scroll"></div>').insertBefore('.page-container');
		$('.page-container').appendTo("#scroll");
	}

	// Create iScroll container for terminal anyway, we got styling on that
	var cont = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
	$("#terminal-output").appendTo(cont);

}
