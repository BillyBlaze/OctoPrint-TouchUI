TouchUI.prototype.DOM.create.headers = {

	init: function() {

		$('.row > .tabbable > .tab-content > div').each(function(ind, elm) {
			var $elm = $(elm);
			var text = $('[href="#' + $elm.attr("id") + '"]').text().trim();

			if ($elm.find('.accordion-heading').length > 0)
				return

			$('<div class="accordion-heading"><a href="#">' + text + '</a></div>').prependTo(elm);

		});

	}

}
