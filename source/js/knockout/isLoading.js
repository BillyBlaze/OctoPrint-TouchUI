TouchUI.prototype.knockout.isLoading = function(touchViewModel, viewModels) {
	var self = this;

	if(self.isActive()) {
		self.components.touchscreen.isLoading.call(self, viewModels);

		// Update scroll area if new items arrived
		if( !self.isTouch ) {
			viewModels.gcodeFilesViewModel.listHelper.paginatedItems.subscribe(function(a) {
				setTimeout(function() {
					self.scroll.iScrolls.body.refresh();
				}, 300);
			});
		}

		// Watch the operational binder for visual online/offline
		viewModels.connectionViewModel.isOperational.subscribe(function(newOperationalState) {
			var printLink = $("#all_touchui_settings");
			if( !newOperationalState ) {
				printLink.addClass("offline").removeClass("online");
				$("#conn_link2").addClass("offline").removeClass("online");
			} else {
				printLink.removeClass("offline").addClass("online");
				$("#conn_link2").removeClass("offline").addClass("online");
			}
		});

		// Reload CSS or LESS after saving our settings
		var afterSettingsSave = ko.computed(function() {
			return !viewModels.settingsViewModel.receiving() && !viewModels.settingsViewModel.sending() && touchViewModel.settingsUpdated();
		});
		afterSettingsSave.subscribe(function(settingsSaved) {
			if(settingsSaved && !touchViewModel.settings.error()) {
				var $less = $("#touchui-custom-less"),
					$css = $("#touchui-css-only");

				touchViewModel.settingsUpdated(false);
				if(touchViewModel.settings.hasLESS()) {

					if($less.length === 0) {
						$('<link href="' + $("#data-touchui").attr("data-less") + '" rel="stylesheet/less" type="text/css" media="screen" id="touchui-custom-less">').appendTo("body");
						less.sheets[0] = document.getElementById('touchui-custom-less');
					}

					$less.attr("href", $("#data-touchui").attr("data-less") + "?v=" + new Date().getTime());
					$('style:not(#touch_updates_css)').remove();
					$css.remove();
					less.refresh();

				} else {

					if($css.length === 0) {
						$('<link rel="stylesheet" type="text/css" media="screen" id="touchui-css-only">').appendTo("head").attr("href", $("#data-touchui").attr("data-css"));
					}

					$('style:not(#touch_updates_css)').remove();
					$less.remove();

				}
			}
		});
	}

	// Check if we can show whats new in this version
	touchViewModel.settings.whatsNew.subscribe(function(whatsNew) {
		if(whatsNew !== false && whatsNew.trim() != "") {
			new PNotify({
				title: 'TouchUI: What\'s new?',
				text: whatsNew,
				icon: 'glyphicon glyphicon-question-sign',
				type: 'info',
				hide: false
			});
		}
	});

	// Display any backend errors
	touchViewModel.settings.error.subscribe(function(hasError) {
		if(hasError !== false && hasError.trim() != "") {

			// If Settings Modal is open, then block the hide of the modal once
			if(viewModels.settingsViewModel.settingsDialog.is(":visible")) {
				var tmp = viewModels.settingsViewModel.settingsDialog.modal;
				viewModels.settingsViewModel.settingsDialog.modal = function() {
					viewModels.settingsViewModel.settingsDialog.modal = tmp;
				};
			}

			new PNotify({
				title: 'TouchUI: Whoops, something went wrong...',
				text: hasError,
				icon: 'glyphicon glyphicon-question-sign',
				type: 'error',
				hide: false
			});
		}
	});

}
