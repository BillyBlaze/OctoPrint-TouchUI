!function() {

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
