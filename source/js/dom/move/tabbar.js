TouchUI.prototype.DOM.move.tabbar = {
	init: function() {
		//var howManyToSplice = ($("#webcam_container").length > 0) ? 3 : 4;

		var $items = $("#tabs > li:not(#print_link, #touchui_dropdown_link, .hidden_touch)");
		$($items).each(function(ind, elm) {
			var $elm = $(elm);

			// Clone the items into the dropdown, and make it click the orginal link
			$elm
				.clone()
				.attr("id", $elm.attr("id")+"2")
				.prependTo("#all_touchui_settings > .dropdown-menu")
				.find("a")
				.off("click")
				.on("click", function(e) {
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
		
		var resize = function() {
			var width = $('#print_link').width();
			var winWidth = $(window).width();
			var items = $('#tabs > li');
			var itemsFit = Math.ceil(winWidth / width) - 3;

			if (winWidth > (width * 2)) {
				items.each(function(key, elm) {
					if (key > itemsFit) {
						$(elm).addClass('hidden_touch');
						$('#' + $(elm).attr('id') + '2').removeClass('hidden_touch');
					} else {
						$(elm).removeClass('hidden_touch');
						$('#' + $(elm).attr('id') + '2').addClass('hidden_touch');
					}
				});
			}
		}

		$(window).on('resize.touchui.tabbar', resize);
		$(window).on('resize.touchui.tabbar', _.debounce(resize, 200));
		$(window).on('resize.touchui.tabbar', _.debounce(resize, 600));
		resize();

	}
}
