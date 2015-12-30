TouchUI.prototype.plugins.screenSquish = function(softwareUpdateViewModel, pluginManagerViewModel) {

	softwareUpdateViewModel.versions.items.subscribe(function(changes) {

		var ScreenSquish = pluginManagerViewModel.plugins.getItem(function(elm) {
			return (elm.key === "ScreenSquish");
		}, true) || false;

		if(ScreenSquish && ScreenSquish.enabled) {
			new PNotify({
				title: 'TouchUI: ScreenSquish is running',
				text: 'Running ScreenSquish and TouchUI will give issues since both plugins try the same, we recommend turning off ScreenSquish.',
				icon: 'glyphicon glyphicon-question-sign',
				type: 'error',
				hide: false,
				confirm: {
					confirm: true,
					buttons: [{
						text: 'Disable ScreenSquish',
						addClass: 'btn-primary',
						click: function(notice) {
							if(!ScreenSquish.pending_disable) {
								pluginManagerViewModel.togglePlugin(ScreenSquish);
							}
							notice.remove();
						}
					}]
				},
			});
		}

	});

};
