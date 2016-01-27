TouchUI.prototype.DOM.move.terminal = {

	init: function() {

		// Add version number placeholder
		$('<span></span>').prependTo("#terminal-output");

		// Create iScroll container for terminal
		var container = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
		var inner = $('<div id="terminal-scroll-inner"></div>').appendTo(container);
		$("#terminal-output").appendTo(inner);
		$("#terminal-output-lowfi").appendTo(inner);

	}

};
