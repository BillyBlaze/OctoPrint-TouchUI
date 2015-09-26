!function ($) {

	$.fn.TouchUI.slider = {

		init: function() {

			// Destroy bootstrap control sliders
			$('#control .slider').each(function(ind, elm) {
				$(elm).addClass("hidden");
				$('<input type="number">').insertAfter(elm).on("change", function(e) {
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
				}).val($(elm).children("input").data('slider').getValue());
			});
		}
	};

}(window.jQuery);
