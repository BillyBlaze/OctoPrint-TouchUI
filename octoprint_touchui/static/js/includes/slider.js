!function ($) {

	$.fn.TouchUI.slider = {

		init: function() {

			// Destroy bootstrap control sliders
			$('#control .slider').each(function(ind, elm) {
				var $elm = $(elm),
					$next = $(elm).next();

				$elm.addClass("hidden");

				var div = $('<div class="slider-container"></div>').insertAfter($elm);

				$elm.appendTo(div);
				$next.appendTo(div);

				var inp = $('<input type="number">').attr("data-bind", "enable: isOperational() && loginState.isUser()").appendTo(div).on("change", function(e) {
					var slider = $(elm).children("input").data('slider'),
						val = parseFloat($(e.delegateTarget).val());

					if(isNaN(val) || slider === undefined) {
						return;
					}

					if(val > slider.max) {
						val = slider.max;
					}
					if(val < slider.min) {
						val = slider.min;
					}

					$(e.delegateTarget).attr("max", slider.max).attr("min", slider.min).val(val);

					slider.element
						.data('value', val)
						.prop('value', val)
						.trigger({
							type: 'slide',
							value: val
						});
				}).attr("id", "ui-inp-"+ind).val($(elm).children("input").data('slider').getValue());

				$('<label for="ui-inp-'+ind+'"></label>').appendTo(div).text((ind === 0) ? "Flowrate:": "Feedrate:");
			});
		}
	};

}(window.jQuery);
