TouchUI.prototype.DOM.overwrite.tabbar = function() {

	// Force the webcam tab to load the webcam feed that original is located on the controls tab
	$('#tabs [data-toggle=tab]').each(function(ind, elm) {

		// Get the currently attached events to the toggle
		var events = $.extend([], jQuery._data(elm, "events").show),
			$elm = $(elm);

		// Remove all previous set events and call them after manipulating a few things
		$elm.off("show").on("show", function(e) {
			var scope = this,
				current = e.target.hash,
				previous = e.relatedTarget.hash;

			current = (current === "#control") ? "#control_without_webcam" : current;
			current = (current === "#webcam") ? "#control" : current;

			previous = (previous === "#control") ? "#control_without_webcam" : previous;
			previous = (previous === "#webcam") ? "#control" : previous;

			// Call previous unset functions (e.g. let's trigger the event onTabChange in all the viewModels)
			$.each(events, function(key, event) {
				event.handler.call(scope, {
					target: {
						hash: current
					},
					relatedTarget: {
						hash: previous
					}
				});
			});
		})
	});

}
