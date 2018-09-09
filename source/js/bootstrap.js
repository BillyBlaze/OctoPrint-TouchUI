!function() {

	// Catch errors
	if (window.log && window.log.error) {
		var old = window.log.error;
		window.log.error = function(plugin, msg) {
			window.top.postMessage([msg, ''], "*");
			old.apply(window.log, arguments);
		}
	}

	var Touch = new TouchUI();
	Touch.domLoading();

	$(function() {
		Touch.domReady();

		OCTOPRINT_VIEWMODELS.push([
			Touch.koStartup,
			Touch.TOUCHUI_REQUIRED_VIEWMODELS,
			Touch.TOUCHUI_ELEMENTS,
			Touch.TOUCHUI_REQUIRED_VIEWMODELS
		]);
	});

}();
