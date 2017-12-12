TouchUI.prototype.knockout.isLoading = function (viewModels) {
	var self = this;

	if(self.isActive()) {
		self.components.touchscreen.isLoading.call(self, viewModels);

		// Reload dimensions of webcam with onload event
		// Legacy code from 1.3.3
		// Fixes bug #78
		if(viewModels.controlViewModel && viewModels.controlViewModel.updateRotatorWidth) {
			$("#webcam_image").on("load", function() {
				viewModels.controlViewModel.updateRotatorWidth();
			});
		}

		// Prevent user from double clicking in a short period on buttons
		$(document).on("click", "button:not(#login_button, .box, .distance, .dropdown-toggle, .btn-input-inc, .btn-input-dec, .temperature_target .btn-group button)", function(e) {
			var printer = $(e.target);
			printer.prop('disabled', true);

			setTimeout(function() {
				printer.prop('disabled', false);
			}, 600);
		});

		// Update scroll area if new items arrived
		if( !self.settings.hasTouch ) {
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
	self.settings.whatsNew.subscribe(function(whatsNew) {
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

}
