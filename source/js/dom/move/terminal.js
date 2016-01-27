TouchUI.prototype.DOM.move.terminal = {

	init: function() {

		// Create iScroll container for terminal anyway, we got styling on that
		var container = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
		var inner = $('<div id="terminal-scroll-inner"></div>').appendTo(container);
		$("#terminal-output").appendTo(inner);
		$("#terminal-output-lowfi").appendTo(inner);

	}

};
