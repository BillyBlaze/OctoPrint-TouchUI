TouchUI.prototype.scroll.overwrite = function(terminalViewModel) {
	var self = this;

	if ( !this.settings.hasTouch ) {

		// Enforce no scroll jumping
		$(".octoprint-container").on("scroll", function(e) {
			if($(e.target).scrollLeft() !== 0) {
				$(e.target).scrollLeft(0);
			}
		});

		// Overwrite scrollToEnd function with iScroll functions
		terminalViewModel.scrollToEnd = function() {
			if ($('#term.active').length) {
				self.scroll.refresh(self.scroll.iScrolls.terminal);
				self.scroll.iScrolls.terminal.scrollTo(0, self.scroll.iScrolls.terminal.maxScrollY);
			}
		};

		// Overwrite orginal helper, add one step and call the orginal function
		var showOfflineOverlay = window.showOfflineOverlay;
		window.showOfflineOverlay = function(title, message, reconnectCallback) {
			showOfflineOverlay.call(this, title, message, reconnectCallback);
			self.scroll.overlay.refresh.call(self);
		};

		// Overwrite orginal helper, add one step and call the orginal function
		var showConfirmationDialog = window.showConfirmationDialog;
		window.showConfirmationDialog = function(message, onacknowledge) {
			self.scroll.iScrolls.body.scrollTo(0, 0, 500);
			showConfirmationDialog.call(this, message, onacknowledge);
		};

		// Overwrite orginal helper, add one step and call the orginal function
		var showReloadOverlay = $.fn.show;
		$.fn.show = function(e,r,i) {
			if($(this).hasClass("iscroll")) {
				setTimeout(function() {
					self.scroll.overlay.refresh.call(self);
				}, 0);
			}

			return showReloadOverlay.call(this,e,r,i);
		}

	} else {

		// Overwrite scrollToEnd function with #terminal-scroll as scroller
		terminalViewModel.scrollToEnd = function() {
			if ($('#term.active').length) {
				var $container = $("#terminal-scroll");
				if ($container.length) {
					$container.scrollTop($container[0].scrollHeight - $container.height())
				}
			}
		}

	}

	// Resize height of low-fi terminal to enable scrolling
	terminalViewModel.plainLogOutput.subscribe(function() {
		if ($('#term.active').length && terminalViewModel.autoscrollEnabled()) {
			terminalViewModel.scrollToEnd();
		}
	});

	// Refresh terminal scroll height
	terminalViewModel.displayedLines.subscribe(function() {
		if ($('#term.active').length && terminalViewModel.autoscrollEnabled()) {
			terminalViewModel.scrollToEnd();
		}
	});

	// Redo scroll-to-end interface
	$("#term .terminal small.pull-right").html('<a href="#"><i class="fa fa-angle-double-down"></i></a>').on("click", function() {
		terminalViewModel.scrollToEnd();
		return false;
	});
}
