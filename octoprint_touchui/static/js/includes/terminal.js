!function ($) {

	$.fn.TouchUI.terminal = {

		init: function(terminalViewModel) {
			var self = this;

			// terminalViewModel.displayedLines.subscribe(function(array) {
			// 	return self.terminal.syntax.highlight.call(self.terminal.syntax, terminalViewModel);
			// }, $("#terminal-output")[0] , "beforeChange");

		},

		// syntax: {
		//
		// 	highlight: function(terminalViewModel) {
		// 		var array = terminalViewModel.log(),
		// 		 	tmp, tmp2 = "",
		// 			self = this;
		//
		// 		$.each(array, function(id, el) {
		// 			if(!el.isProcessed) {
		// 				var line = el.line;
		// 				el.isProcessed = true;
		// 				$.each(line.split(" "), function(ind, elm) {
		//
		// 					tmp = elm.match(/([a-zA-Z]+)|([:])|([A-Z]{1})|([0-9.-]+)/gm);
		// 					$.each(tmp, function(idx, string) {
		//
		// 						if(!isNaN(parseFloat(string))) {
		// 							tmp2 += '<span class="number">'+string+'</span> ';
		// 						} else if(string.length === 1) {
		// 							if(string == ":") {
		// 								tmp2 += '<span class="divider">:</span> ';
		// 							} else {
		// 								tmp2 += '<span class="letter">'+string+'</span> ';
		// 							}
		// 						} else {
		// 							tmp2 += '<span class="word">'+string+'</span> ';
		// 						}
		// 					});
		//
		// 				});
		//
		// 				el.line = tmp2;
		// 			}
		// 		});
		//
		// 		return array;
		//
		// 	}
		//
		// }

	};

}(window.jQuery);
