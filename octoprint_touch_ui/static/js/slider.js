window.TouchUI = window.TouchUI || {};
window.TouchUI.slider = {
	init: function() {
		
		/* Add touch friendly sliders for temps */
		$($('#temp .row-fluid table tr').splice(1)).each(function(ind, elm) {
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
	}
};