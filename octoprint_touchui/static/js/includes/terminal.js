!function ($) {

	$.fn.TouchUI.terminal = {

		init: function(terminalViewModel) {

			console.log(terminalViewModel);
			this.terminal.syntax.highlight.call(this, terminalViewModel);

		},

		syntax: {

			recieve: /([A-Z]+)([0-9.]+)/,
			highlight: function(terminalViewModel) {

			}

		}

	};

}(window.jQuery);
