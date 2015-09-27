!function ($) {

	$.fn.TouchUI.knockout = {

		beforeLoad: function() {
			var self = this;

			// Inject newer fontawesome
			$('<link href="/static/webassets/fonts/fontawesome.css" rel="stylesheet"></link>').appendTo("head");
			$('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1"/>').appendTo("head");

			this.DOM.create.init.call(this);
			this.scroll.beforeLoad.call(this);

		},

		isReady: function(viewModels) {
			var self = this,
				terminalViewModel = viewModels[0],
				connectionViewModel = viewModels[1],
				settingsViewModel = viewModels[2],
				softwareUpdateViewModel = viewModels[3],
				controlViewModel = viewModels[4],
				gcodeViewModel = viewModels[5];

			this.terminal.init.call(this, terminalViewModel);

			// Remove slimScroll from files list
			$('.gcode_files').slimScroll({destroy: true});
			$('.slimScrollDiv').slimScroll({destroy: true});

			// Remove drag files into website feature
			$(document).off("dragover");

			// Watch the operational binder for visual online/offline
			var subscription = connectionViewModel.isOperational.subscribe(function(newOperationalState) {
				var printLink = $("#navbar_login");
				if( !newOperationalState ) {
					printLink.addClass("offline").removeClass("online");
					$("#conn_link2").addClass("offline").removeClass("online");
				} else {
					printLink.removeClass("offline").addClass("online");
					$("#conn_link2").removeClass("offline").addClass("online");
				}
			});

			// Redo scroll-to-end interface
			$("#term .terminal small.pull-right").html('<a href="#"><i class="fa fa-angle-double-down"></i></a>').on("click", function() {
				if (!self.isTouch) {
					terminalViewModel.scrollToEnd();
					return false;
				}
			});

			if( !this.isTouch ) {
				this.scroll.terminal.knockoutOverwrite.call(this, terminalViewModel);
			}

			this.DOM.move.init.call(this);
			this.main.version.init.call(this, settingsViewModel, softwareUpdateViewModel);

			// Add class with how many tab-items
			$("#tabs, #navbar").addClass("items-" + $("#tabs li:not(.hidden_touch)").length);

			// Hide topbar if clicking an item
			// Notice: Use delegation in order to trigger the event after the tab content has changed, other click events fire before content change.
			// TODO: Make this a setting in the options
			$(document).on("click", '#tabs [data-toggle="tab"]', function() {
				self.animate.hide.call(self, "navbar");
			});

			// (Re-)Apply bindings to the new webcam div
			if($("#webcam").length > 0) {
				ko.applyBindings(controlViewModel, $("#webcam")[0])
			}

		}
	}

}(window.jQuery);
