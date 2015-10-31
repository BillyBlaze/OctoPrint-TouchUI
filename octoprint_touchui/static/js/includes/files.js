!function ($) {

	$.fn.TouchUI.files = {
		init: function() {
			var self = this;

			if( !this.isTouch ) {
				// Refresh body on dropdown click
				$(document).on("click", ".container .dropdown-menu li a", function() {
					setTimeout(function() {
						self.scroll.iScrolls.body.refresh();
					}, 0);
				});

				// Refresh body and scroll to previous element
				$(document).on("click", ".container .pagination ul li a", function(e) {
					setTimeout(function() {
						self.scroll.iScrolls.body.refresh();
					}, 0);
				});
			}

			this.files.touchList();
		},

		touchList: function() {
			/* Add touch friendly files list */
			var self = this,
				touch = false,
				start = 0,
				namespace = ".files.touchui";

			$(document).on("mousedown touchstart", "#files .entry, #temp .row-fluid", function(e) {
				touch = e.currentTarget;
				start = e.pageX || e.originalEvent.targetTouches[0].pageX;

				$(document).one("mouseup"+namespace+" touchend"+namespace, function(e) {
					touch = false;
					start = 0;

					$(document).off(namespace);
				});

				$(document).on("mousemove"+namespace+" touchmove"+namespace, function(event) {
					if(touch !== false) {
						var current = event.pageX || event.originalEvent.targetTouches[0].pageX;

						if(current > start + 80) {
							$(document).trigger("files.open", event.target);
							$(touch).removeClass("open");
							start = current;
						} else if(current < start - 80) {
							$(document).trigger("files.closed", event.target);
							$(touch).addClass("open");
							start = current;

							if( $(touch).find(".btn-group").children().length > 4 ) {
								$(touch).addClass("large");
							}
						}

					}
				});

			});

		}
	};

}(window.jQuery);
