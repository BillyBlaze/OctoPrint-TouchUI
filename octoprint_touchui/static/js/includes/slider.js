!function ($) {

	$.fn.TouchUI.slider = {

		init: function() {

			// Destroy bootstrap control sliders
			$('#control .slider').each(function(ind, elm) {
				var $elm = $(elm),
					$next = $(elm).next(),
					text = $next.text().split(":")[0].replace(" ", "");

				$elm.addClass("hidden");

				var div = $('<div class="slider-container"></div>').insertAfter($elm);

				$elm.appendTo(div);
				$next.appendTo(div);

				var inp = $('<input type="number">').attr("data-bind", "enable: isOperational() && loginState.isUser(), value: " + ((text == "Flowrate") ? "flowRate" : "feedRate")).appendTo(div);

				$('<label for="ui-inp-'+ind+'"></label>').appendTo(div).text(text + ":");
			});
		}
	};

}(window.jQuery);
