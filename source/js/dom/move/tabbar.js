TouchUI.prototype.DOM.move.tabbar = {
	mainItems: ['#print_link', '#temp_link', '#control_link', '#webcam_link', '#term_link', '.hidden_touch'],
	init: function() {

		$items = $("#tabs > li:not("+this.DOM.move.tabbar.mainItems+")");
		$items.each(function(ind, elm) {
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
