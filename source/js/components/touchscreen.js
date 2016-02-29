TouchUI.prototype.components.touchscreen = {

	init: function () {
		$("html").addClass("isTouchscreenUI");
		this.settings.hasTouch = false;
		this.settings.isTouchscreen(true);

		if (this.settings.isEpiphanyOrKweb) {
			this.settings.hasFullscreen(false);
		}

		// Improve performace
		this.scroll.defaults.iScroll.scrollbars = false;
		this.scroll.defaults.iScroll.interactiveScrollbars = false;
		this.scroll.defaults.iScroll.useTransition = false;
		// this.scroll.defaults.iScroll.useTransform = false;
		// this.scroll.defaults.iScroll.HWCompositing = false;
	},

	isLoading: function (viewModels) {

		if(this.settings.isTouchscreen()) {
			if(viewModels.terminalViewModel.enableFancyFunctionality) { //TODO: check if 1.2.9 to not throw errors in 1.2.8<
				 viewModels.terminalViewModel.enableFancyFunctionality(false);
			}
		}

	}

}
