!function ($) {

	$.fn.TouchUI = {};
	$.fn.TouchUI.version = {

		init: function(settingsViewModel, softwareUpdateViewModel) {
			var self = this;

			//Get currect version from settingsView and store them
			this.version.build = settingsViewModel.settings.plugins.touchui.version();

			// Update the content of the version
			$('head').append('<style id="touch_updates_css">#term pre span:first-child:before{ content: "v'+this.version.build+'" !important; }</style>');

			softwareUpdateViewModel.versions.items.subscribe(function(changes) {

				var touchui = softwareUpdateViewModel.versions.getItem(function(elm) {
					return (elm.key === "touchui");
				}, true) || false;

				if( touchui !== false && (touchui.information.remote.value !== self.version.build && touchui.information.remote.value !== null) ) {
					$("#touch_updates_css").remove();
					$('head').append('<style id="touch_updates_css">#term pre span:first-child:before{ content: "v'+self.version.build+" outdated, new version: v"+touchui.information.remote.value+'" !important; }</style>');
				}

			});

		}

	};

}(window.jQuery);
