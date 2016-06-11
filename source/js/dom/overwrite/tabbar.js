TouchUI.prototype.DOM.overwrite.tabbar = function() {

	// Force the webcam tab to load the webcam feed that original is located on the controls tab
	$('#tabs [data-toggle=tab], #all_touchui_settings [data-toggle=tab]').each(function(ind, elm) {

		// Get the currently attached events to the toggle
		var show = $.extend({}, jQuery._data(elm, "events").show);
		var shown = $.extend({}, jQuery._data(elm, "events").shown);
		var $elm = $(elm);
		var prev = {};

		delete show.delegateCount;
		delete shown.delegateCount;

		// Remove all previous set events and call them after manipulating a few things
		$elm.off("show").on("show", function(e) {
			var scope = this;
			var current = e.target.hash;
			var previous = prev.hash || "";
			prev = e.target;

			current = (current === "#control") ? "#control_without_webcam" : current;
			current = (current === "#webcam") ? "#control" : current;

			previous = (previous === "#control") ? "#control_without_webcam" : previous;
			previous = (previous === "#webcam") ? "#control" : previous;

			// Unset all is-active and active
			$("#tabs li, .tabs-mirror").removeClass('active').find('a').removeClass('is-active');

			// Add active and is-active to mirror or tabbar
			if ($(e.target).parents('#tabs').length) {
				$("#" + $(e.target).parent().attr('id') + "_mirror").addClass('active').find('a').addClass('is-active');
				$("#" + $(e.target).parent().attr('id') + "_clone").addClass('active').find('a').addClass('is-active');
			} else {
				$("#" + $(e.target).parent().attr('id').replace("_mirror", "")).addClass('active').find('a').addClass('is-active');
				$("#" + $(e.target).parent().attr('id').replace("_mirror", "_clone")).addClass('active').find('a').addClass('is-active');
			}

			// Call previous unset functions (e.g. let's trigger the event onTabChange in all the viewModels)
			if (show) {
				$.each(show, function(key, event) {
					event.handler.call(scope, {
						target: {
							hash: current
						},
						relatedTarget: {
							hash: previous
						}
					});
				});
			}
		});

		// Redo shown to give everyone the right previous
		$elm.off("shown").on("shown", function(e) {
			var scope = this;
			var current = e.target.hash;
			var previous = prev.hash || "";

			// Call previous unset functions (e.g. let's trigger the event onTabChange in all the viewModels)
			if (shown) {
				$.each(shown, function(key, event) {
					event.handler.call(scope, {
						target: {
							hash: current
						},
						relatedTarget: {
							hash: previous
						}
					});
				});
			}
		});
	});

}
