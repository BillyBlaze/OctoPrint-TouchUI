window.TouchUI = window.TouchUI || {};
window.TouchUI.slider = {
	init: function() {
		
		/* Add touch friendly sliders for temps
		setTimeout(function() {
			$('#temp .row-fluid table tr[data-bind]').each(function(ind, elm) {
				var input = $(elm).find('input[type="text"]');
				
				var slider = $('<div class="circ-slider no-mouse-scroll"></div>').insertBefore("#temp table").CircularSlider({ 
					min: 0, 
					max: 280, 
					value: 0,
					labelSuffix: $(elm).find("td:last-child .add-on").text(),
					labelPrefix: "<b>" + $(elm).find("th:first-child").text() + "</b>",
					shape: "Half Circle",
					slide: function(ui, value) {
						if(!input.is("[disabled]")) {
							input.val(value).trigger("keyup");
						}
					}
				});
				
				input.change(function(e) {
					if(input.is("[disabled]")) {
						slider.addClass("disabled");
					} else if(!isNaN(parseFloat(input.val()))) {
						slider.removeClass("disabled");
						slider.value(parseFloat(input.val()));
					}
				}).trigger("change");
			});
		}, 1000); */
			
		// Destroy bootstrap control sliders
		$('#control .slider').each(function(ind, elm) {
			$(elm).addClass("hidden");
			$('<input type="number">').insertAfter(elm).on("change", function(e) {
				var slider = $(elm).children("input").data('slider'),
					val = parseFloat($(e.delegateTarget).val());
				
				console.log(val, slider, e);
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