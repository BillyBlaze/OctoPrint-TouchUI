TouchUI.prototype.components.touchscreen = {

	init: function () {
		$("html").addClass("isTouchscreenUI");
		
		if (this.settings.isEpiphanyOrKweb) {
			this.settings.hasTouch = false;
			this.scroll.defaults.iScroll.disableTouch = true;
			this.scroll.defaults.iScroll.disableMouse = false;
		}
		
		this.settings.isTouchscreen(true);

		if (this.settings.isEpiphanyOrKweb || this.settings.isChromiumArm) {
			this.settings.hasFullscreen(false);
		}
		
		$('.modal.fade').removeClass('fade');
		$('#gcode_link').remove();

		// Improve performace
		this.scroll.defaults.iScroll.scrollbars = false;
		this.scroll.defaults.iScroll.interactiveScrollbars = false;
		this.scroll.defaults.iScroll.useTransition = false;
		// this.scroll.defaults.iScroll.useTransform = false;
		// this.scroll.defaults.iScroll.HWCompositing = false;
	},

	isLoading: function (viewModels) {

		if(this.settings.isTouchscreen()) {
			// Disable fancy functionality
			if(viewModels.terminalViewModel.enableFancyFunctionality) { //TODO: check if 1.2.9 to not throw errors in 1.2.8<
				 viewModels.terminalViewModel.enableFancyFunctionality(false);
			}

			// Disable GCodeViewer in touchscreen mode
			if (viewModels.gcodeViewModel) {
				console.info("TouchUI: GCodeViewer is disabled while TouchUI is active and in touchscreen mode.");
				viewModels.gcodeViewModel.enabled = false;
				viewModels.gcodeViewModel.initialize = _.noop;
				viewModels.gcodeViewModel.clear = _.noop;
				viewModels.gcodeViewModel._processData = _.noop;
			}
		}

	}

}
