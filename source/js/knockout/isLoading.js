TouchUI.prototype.knockout.isLoading = function (viewModels) {
	var self = this;

	if(self.isActive()) {

		self.components.material.sidenav.call(self);
		self.components.touchscreen.isLoading.call(self, viewModels);

		$("#tabs").appendTo("#navbar");

		// Prevent user from double clicking in a short period on buttons
		// $(document).on("click", "button:not(.box, .distance, .dropdown-toggle)", function(e) {
		// 	var printer = $(e.target);
		// 	printer.prop('disabled', true);
		//
		// 	setTimeout(function() {
		// 		printer.prop('disabled', false);
		// 	}, 600);
		// });

		// Reload dimensions of webcam with onload event
		// Fixes bug #78
		$("#webcam_image").on("load", function() {
			viewModels.controlViewModel.updateRotatorWidth();
		});

		viewModels.temperatureViewModel.heaterOptions.subscribe(function(heaterOptions) {
			var tmp;

			_.each(_.keys(heaterOptions), function(type) {
				if (
					heaterOptions[type].color !== $('#navbar').css("background-color") &&
					heaterOptions[type].color !== $('.bar').css("background-color")
				) {
					tmp = true;
					if (heaterOptions[type].name === "Bed") {
						heaterOptions[type].color = $('.bar').css("background-color");
					} else {
						heaterOptions[type].color = $('#navbar').css("background-color");
					}
				}
			});

			if (tmp) {
				viewModels.temperatureViewModel.heaterOptions(heaterOptions);
			}
		});

		// Update scroll area if new items arrived
		if( !self.settings.hasTouch ) {
			viewModels.gcodeFilesViewModel.listHelper.paginatedItems.subscribe(function(a) {
				setTimeout(function() {
					self.scroll.refresh(self.scroll.iScrolls.body);
				}, 300);
			});
		}

		// Watch the operational binder for visual online/offline
		viewModels.connectionViewModel.isOperational.subscribe(function(newOperationalState) {
			var printLink = $("#all_touchui_settings");
			if( !newOperationalState ) {
				printLink.addClass("offline").removeClass("online");
				$("#conn_link_mirror").addClass("offline").removeClass("online");
			} else {
				printLink.removeClass("offline").addClass("online");
				$("#conn_link_mirror").removeClass("offline").addClass("online");
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
