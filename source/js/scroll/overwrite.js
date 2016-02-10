TouchUI.prototype.scroll.overwrite = function(terminalViewModel) {
	var self = this;

	if ( !this.isTouch ) {

		// Enforce no scroll jumping
		$("#scroll").on("scroll", function() {
			if($("#scroll").scrollTop() !== 0) {
				$("#scroll").scrollTop(0);
			}
		});

		// Refresh terminal scroll height
		terminalViewModel.displayedLines.subscribe(function() {
			self.scroll.iScrolls.terminal.refresh();
		});

		// Overwrite scrollToEnd function with iScroll functions
		terminalViewModel.scrollToEnd = function() {
			self.scroll.iScrolls.terminal.refresh();
			self.scroll.iScrolls.terminal.scrollTo(0, self.scroll.iScrolls.terminal.maxScrollY);
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
			showReloadOverlay.call(this,e,r,i);

			if($(this).hasClass("iscroll")) {
				self.scroll.overlay.refresh.call(self);
			}
		}

	} else {

		// Overwrite scrollToEnd function with #terminal-scroll as scroller
		terminalViewModel.scrollToEnd = function() {
			var $container = $("#terminal-scroll");
			if ($container.length) {
				$container.scrollTop($container[0].scrollHeight - $container.height())
			}
		}

	}
}
