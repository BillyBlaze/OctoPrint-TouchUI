TouchUI.prototype.DOM.move.tabbar = {
	init: function(viewModels) {

		var $items = $("#tabs > li:not(#print_link, #touchui_dropdown_link, .hidden_touch)");
		$($items.get().reverse()).each(function(ind, elm) {
			var $elm = $(elm);

			// Clone the items into the dropdown, and make it click the orginal link
			$elm
				.clone()
				.attr("id", $elm.attr("id")+"2")
				.removeAttr('style')
				.removeAttr('data-bind')
				.prependTo(this.DOM.create.dropdown.container)
				.find("a")
				.off("click")
				.on("click", function(e) {
					$elm.find('a').click();
					$("#all_touchui_settings").addClass("item_active");
					e.preventDefault();
					return false;
				});

			// $elm.addClass("hidden_touch");
		}.bind(this));

		$("#tabs > li > a").each(function(ind, elm) {
			$(elm).text("");
		});

		var resize = function() {
			var width = $('#print_link').width();
			var winWidth = $(window).width();
			var $items = $('#tabs > li:not("#touchui_dropdown_link")');
			var itemsFit = Math.floor(winWidth / width) - 2;

			// Loop over items; if they contain display: none; then do
			// not show them in the dropdown menu and filter them out from items
			$items = $items.filter(function(i, elm) {
				if (($(elm).attr('style') || "").indexOf('none') !== -1) {
					$('#' + $(elm).attr('id') + '2').addClass('hidden_touch');
					return false;
				}

				return true;
			});

			if (winWidth > (width * 2)) {
				$items.each(function(key, elm) {
					if (key > itemsFit) {
						$(elm).addClass('hidden_touch');
						$('#' + $(elm).attr('id') + '2').removeClass('hidden_touch');
					} else {
						$(elm).removeClass('hidden_touch');
						$('#' + $(elm).attr('id') + '2').addClass('hidden_touch');
					}
				});
			}

			// Sync width of dropdown link
			$('#all_touchui_settings').width(width);
		}

		$(window).on('resize.touchui.tabbar', resize);
		$(window).on('resize.touchui.tabbar', _.debounce(resize, 200));
		$(window).on('resize.touchui.tabbar', _.debounce(resize, 600));

		$(window).trigger('resize.touchui.tabbar');
	}
}
