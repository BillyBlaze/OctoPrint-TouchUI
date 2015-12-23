!function ($) {

	$.fn.TouchUI.plugins = {

		init: function(touchViewModel, viewModels) {
			this.plugins.screenSquish(viewModels[3], viewModels[7]);
		},

		screenSquish: function(softwareUpdateViewModel, pluginManagerViewModel) {

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

		},

		navbarTemp: function() {

			// Manually move navbar temp (hard move)
			if( $("#navbar_plugin_navbartemp").length > 0 ) {
				var navBarTmp = $("#navbar_plugin_navbartemp").appendTo(this.DOM.create.dropdown.container);
				$('<li class="divider"></li>').insertBefore(navBarTmp);
				$("<!-- ko allowBindings: false -->").insertBefore(navBarTmp);
				$("<!-- /ko -->").insertAfter(navBarTmp);
			}

		}


	};

}(window.jQuery);
