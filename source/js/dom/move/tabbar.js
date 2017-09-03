TouchUI.prototype.DOM.move.tabbar = {
	init: function() {
		var howManyToSplice = ($("#webcam_container").length > 0) ? 3 : 4;

		var $items = $("#tabs > li:not(#print_link, .hidden_touch)");
		$($items.splice(howManyToSplice)).each(function(ind, elm) {
			var $elm = $(elm);

			// Clone the items into the dropdown, and make it click the orginal link
			$elm.clone().attr("id", $elm.attr("id")+"2").appendTo("#all_touchui_settings .dropdown-menu").find('a').off("click").on("click", function(e) {
				$elm.find('a').click();
				$("#all_touchui_settings").addClass("item_active");
				e.preventDefault();
				return false;
			});
			$elm.addClass("hidden_touch");

		}.bind(this));

		$items = $("#tabs > li > a");
		$items.each(function(ind, elm) {
			$(elm).text("");
		}.bind(this));

	}
}
