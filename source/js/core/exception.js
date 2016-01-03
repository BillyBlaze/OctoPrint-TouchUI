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

		var text = '<p>Please help improving this plugin by <a href="https://github.com/BillyBlaze/OctoPrint-TouchUI/issues/new?body={BODY}">submiting</a> the following error together with the OctoPrint version and browser you\'re using: </p><ul><li>',
			err = '',
			body = '';

		if(arguments.length > 4) {
			err += "<strong>" + arguments[4].message + "</strong><br>";
			err += "<small>" + arguments[4].stack + "</small>";
		} else {
			err += "<strong>" + arguments[0] + "</strong><br>";
			err += "<small>" + arguments[1] + " @ " + arguments[2] + "</small>";
		}

		text += err + "</li></ul>";
		body = encodeURIComponent("\n\n\n------- \n````\n" + err.replace(/(<br>)/g, "\n").replace(/(<([^>]+)>)/g, "") + "\n````");

		new PNotify({
			title: 'TouchUI: Javascript error...',
			text:  text.replace("{BODY}", body),
			icon: 'glyphicon glyphicon-question-sign',
			type: 'error',
			hide: false,
			confirm: false
		});

	}
}
