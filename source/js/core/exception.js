TouchUI.prototype.core.exception = function() {

	var old = window.onerror || function() {};
	window.onerror = function() {
		old.call(this, arguments);

		// Supress these errors
		if(arguments[0].indexOf("CanvasRenderingContext2D") > -1) {//Failed to execute 'arc' on 'CanvasRenderingContext2D'
			return;
		}
		if(arguments[0].indexOf("highlightFill") > -1) {//Cannot read property 'highlightFill'
			return;
		}

		var text = '<p>Please help improving this plugin by <a href="https://github.com/BillyBlaze/OctoPrint-TouchUI/issues/new">submiting</a> the following error together with the OctoPrint version and browser you\'re using: </p><ul><li>';
		if(arguments.length > 4) {
			text += "<strong>" + arguments[4].message + "</strong><br>";
			text += "<small>" + arguments[4].stack + "</small>";
		} else {
			text += "<strong>" + arguments[0] + "</strong><br>";
			text += "<small>" + arguments[1] + " @ " + arguments[2] + "</small>";
		}

		text += "</li></ul>";

		new PNotify({
			title: 'TouchUI: Javascript error...',
			text:  text,
			icon: 'glyphicon glyphicon-question-sign',
			type: 'error',
			hide: false,
			confirm: false
		});

	}
}
