TouchUI.prototype.core.version = {

	init: function(softwareUpdateViewModel) {
		var self = this;

		$("<span></span>").appendTo("#terminal-output");

		if(softwareUpdateViewModel) {

			softwareUpdateViewModel.versions.items.subscribe(function(changes) {

				var touchui = softwareUpdateViewModel.versions.getItem(function(elm) {
					return (elm.key === "touchui");
				}, true) || false;

				if( touchui !== false && touchui.information !== null ) {
					var remote = Number(touchui.information.remote.value.split('.').join('')),
						local = Number(touchui.information.local.value.split('.').join(''));

					if(remote > local) {
						$("#touch_updates_css").remove();
						$('head').append('<style id="touch_updates_css">#term pre span:first-child:before{ content: "v'+touchui.information.local.value+" outdated, new version: v"+touchui.information.remote.value+'" !important; }</style>');
					} else {
						if( $("#touch_updates_css").length === 0 ) {
							$('head').append('<style id="touch_updates_css">#term pre span:first-child:before{ content: "v'+touchui.information.local.value+'" !important; }</style>');
						}
					}
				}

			});

		}

	}

}
