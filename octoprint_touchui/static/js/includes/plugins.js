!function ($) {

	$.fn.TouchUI.plugins = {
		init: function(touchViewModel, viewModels) {

			viewModels[3].versions.items.subscribe(function(changes) {

				var ScreenSquish = viewModels[7].plugins.getItem(function(elm) {
					return (elm.key === "ScreenSquish");
				}, true) || false;

				if(ScreenSquish && ScreenSquish.enabled) {
					new PNotify({
						title: 'TouchUI: ScreenSquish is running',
						text: 'Running ScreenSquish and TouchUI will give issues since both plugins try the same, we recommend turning off ScreenSquish.',
						icon: 'glyphicon glyphicon-question-sign',
						type: 'info',
						hide: false,
						confirm: {
							confirm: true,
							buttons: [{
								text: 'Disable ScreenSquish',
								addClass: 'btn-primary',
								click: function(notice) {
									viewModels[7].togglePlugin(ScreenSquish);
									notice.remove();
								}
							}]
						},
					});
				}

			});
		}
	};

}(window.jQuery);
