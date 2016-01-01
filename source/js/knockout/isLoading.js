TouchUI.prototype.knockout.isLoading = function(touchViewModel, viewModels) {
	var self = this,
		terminalViewModel = viewModels[0],
		connectionViewModel = viewModels[1],
		settingsViewModel = viewModels[2],
		softwareUpdateViewModel = viewModels[3],
		controlViewModel = viewModels[4],
		gcodeFilesViewModel = viewModels[5];

	this.DOM.init.call(this);
	this.scroll.beforeLoad.call(this);

	if( !self.isTouch ) {
		gcodeFilesViewModel.listHelper.paginatedItems.subscribe(function(a) {
			setTimeout(function() {
				try {
					self.scroll.iScrolls.body.refresh();
				} catch(err) {
					// Do nothing
				};
			}, 300);
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
			if(settingsViewModel.settingsDialog.is(":visible")) {
				var tmp = settingsViewModel.settingsDialog.modal;
				settingsViewModel.settingsDialog.modal = function() {
					settingsViewModel.settingsDialog.modal = tmp;
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

	// Reload CSS or LESS after saving our settings
	var afterSettingsSave = ko.computed(function() {
		return !settingsViewModel.receiving() && !settingsViewModel.sending() && touchViewModel.settingsUpdated();
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

	// Repaint graph after resize (.e.g orientation changed)
	$(window).on("resize", function() {
		viewModels[8].updatePlot();
	});

}
