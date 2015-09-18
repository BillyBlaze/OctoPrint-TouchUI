window.TouchUI = window.TouchUI || {};
window.TouchUI.files = {
	init: function() {
	
	/* Add touch friendly files list */
		var touch = false,
			start = 0;

		$(document).on("mousedown touchstart", "#files .entry", function(e) {
			touch = e.currentTarget;
			start = e.pageX || e.originalEvent.targetTouches[0].pageX;
		});
		$(document).on("mouseup touchend", function(e) {
			touch = false;
			start = 0;
		});
		$(document).on("mousemove touchmove", function(e) {
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
				}
			}
		});
	}
};