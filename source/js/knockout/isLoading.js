TouchUI.prototype.knockout.isLoading = function(touchViewModel, viewModels) {
	var self = this;

	if(self.isActive()) {
		self.components.touchscreen.isLoading.call(self, viewModels);

		// Disable the connection button for a short period after clicking on it
		$("#printer_connect").on("click", function(e) {
			var printer = $(e.target);
			printer.prop('disabled', true);

			setTimeout(function() {
				printer.prop('disabled', false);
			}, 600);
		});

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

	// Check if we need to update the CSS
	var requireNewCSS = ko.computed(function() {
		return touchViewModel.settings.requireNewCSS() && viewModels.loginStateViewModel.isAdmin();
	});
	requireNewCSS.subscribe(function(requireNewCSS) {
		if(requireNewCSS) {
			setTimeout(function() {
				self.core.less.save.call(self, touchViewModel);
			}, 100);
		}
	});

}
