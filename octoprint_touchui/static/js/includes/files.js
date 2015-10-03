!function ($) {

	$.fn.TouchUI.files = {
		init: function() {
			var self = this;

			if( !this.isTouch ) {
				// Refresh body on dropdown click
				$(document).on("click", ".container .dropdown-menu li a", function() {
					self.scroll.iScrolls.body.refresh();
				});

				// Refresh body and scroll to previous element
				$(document).on("click", ".container .pagination ul li a", function(e) {
					self.scroll.iScrolls.body.refresh();
				});
			}

			this.files.touchList();
		},

		touchList: function() {
			/* Add touch friendly files list */
			var self = this,
				touch = false,
				start = 0;

			$(document).on("mousedown touchstart", "#files .entry, #temp .row-fluid", function(e) {
				touch = e.currentTarget;
				start = e.pageX || e.originalEvent.targetTouches[0].pageX;
			});

			$(document).on("mouseup touchend", "#files .entry, #temp .row-fluid", function(e) {
				touch = false;
				start = 0;
			});

			$(document).on("mousemove touchmove", "#files .entry, #temp .row-fluid", function(e) {
				console.log(e, touch, start);
				if(touch !== false) {
					var current = e.pageX || e.originalEvent.targetTouches[0].pageX;

					if(current > start + 80) {
						$(document).trigger("files.open", e.target);
						$(touch).removeClass("open");
						start = current;
					} else if(current < start - 80) {
						$(document).trigger("files.closed", e.target);
						$(touch).addClass("open");
						start = current;

						if( $(touch).find(".btn-group").children().length > 4 ) {
							$(touch).addClass("large");
						}
					}
				}
			});

		}
	};

}(window.jQuery);
