TouchUI.prototype.scroll.init = function() {
	var self = this;

	if ( this.isTouch ) {
		var width = $(window).width();

		// Covert VH to the initial height (prevent height from jumping when navigation bar hides/shows)
		$("#temperature-graph").parent().height($("#temperature-graph").parent().outerHeight());
		$("#terminal-scroll").height($("#terminal-scroll").outerHeight());
		$("#terminal-sendpanel").css("top", $("#terminal-scroll").outerHeight()-1);

		$(window).on("resize", function() {

			if(width !== $(window).width()) {
				$("#temperature-graph").parent().height($("#temperature-graph").parent().outerHeight());
				$("#terminal-scroll").css("height", "").height($("#terminal-scroll").outerHeight());
				$("#terminal-sendpanel").css("top", $("#terminal-scroll").outerHeight()-1);
				width = $(window).width();
			}


		});

	} else {

		// Set overflow hidden for best performance
		$("html").addClass("emulateTouch");

		self.scroll.terminal.init.call(self);
		self.scroll.body.init.call(self);
		self.scroll.modal.init.call(self);

		// Refresh body on dropdown click
		$(document).on("click", ".container .pagination ul li a", function() {
			setTimeout(function() {
				self.scroll.currentActive.refresh();
			}, 0);
		});

	}

}
