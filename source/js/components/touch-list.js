TouchUI.prototype.components.touchList = {
	init: function() {

		/* Add touch friendly files list */
		var self = this;
		var touch = false;
		var start = 0;
		var namespace = ".files.touchui";

		$(document).on("mousedown touchstart", "#files .entry:not(.folder, .back), #temp .row-fluid", function(e) {
			try {
				touch = e.currentTarget;
				start = e.pageX || e.originalEvent.targetTouches[0].pageX;
			} catch(err) {
				return;
			}

			$(document).one("mouseup"+namespace+" touchend"+namespace, function(e) {
				touch = false;
				start = 0;

				$(document).off(namespace);
			});

			$(document).on("mousemove"+namespace+" touchmove"+namespace, function(event) {
				if(touch !== false) {
					try {
						var current = event.pageX || event.originalEvent.targetTouches[0].pageX;

						if(current > start + 80) {
							$(document).trigger("fileclose" + namespace, event.target);
							$(touch).removeClass("open");
							start = current;
						} else if(current < start - 80) {
							$(document).trigger("fileopen" + namespace, event.target);
							$(touch).addClass("open");
							start = current;

							if( $(touch).find(".btn-group").children().length > 4 ) {
								$(touch).addClass("large");
							}
						}
					} catch(err) {
						//Ignore step
					}
				}
			});

		});

	}

}
