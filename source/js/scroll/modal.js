TouchUI.prototype.scroll.modal = {
	stack: [],
	dropdown: null,

	init: function() {
		var $document = $(document),
			self = this;


		// $document.on("modal.touchui", function(e, elm) {
		// 	var $modalElm = $(elm),
		// 		$modalContainer = $(elm).parent();
		//
		// 	// Create temp iScroll within the modal
		// 	var curModal = new IScroll($modalContainer[0], self.scroll.defaults.iScroll);
		//
		// 	// Store into stack
		// 	self.scroll.modal.stack.push(curModal);
		// 	self.scroll.currentActive = curModal;
		//
		// 	// Force iScroll to get the correct scrollHeight
		// 	setTimeout(function() {
		// 		if(curModal) {
		// 			curModal.refresh();
		// 		}
		// 	}, 0);
		// 	// And Refresh again after animation
		// 	setTimeout(function() {
		// 		if(curModal) {
		// 			curModal.refresh();
		// 		}
		// 	}, 800);
		//
		// 	// Store bindings into variable for future reference
		// 	var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $modalElm, curModal),
		// 		scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $modalElm, curModal);
		//
		// 	// Disable all JS events while scrolling for best performance
		// 	curModal.on("scrollStart", scrollStart);
		// 	curModal.on("scrollEnd", scrollEnd);
		// 	curModal.on("scrollCancel", scrollEnd);
		//
		// 	// Refresh the scrollHeight and scroll back to top with these actions:
		// 	$document.on("click.scrollHeightTouchUI", '[data-toggle="tab"], .pagination ul li a', function(e) {
		// 		curModal._end(e);
		//
		// 		setTimeout(function() {
		// 			curModal.refresh();
		// 			curModal.scrollTo(0, 0);
		// 		}, 0);
		// 	});
		//
		// 	// Kill it with fire!
		// 	$modalElm.one("destroy", function() {
		// 		$document.off("click.scrollHeightTouchUI");
		// 		self.scroll.modal.stack.pop();
		//
		// 		if(self.scroll.modal.stack.length > 0) {
		// 			self.scroll.currentActive = self.scroll.modal.stack[self.scroll.modal.stack.length-1];
		// 		} else {
		// 			self.scroll.currentActive = self.scroll.iScrolls.body;
		// 		}
		//
		// 		curModal.destroy();
		// 		curModal.off("scrollStart", scrollStart);
		// 		curModal.off("scrollEnd", scrollEnd);
		// 		curModal.off("scrollCancel", scrollEnd);
		// 		curModal = undefined;
		// 	});
		//
		// });


	}
}
