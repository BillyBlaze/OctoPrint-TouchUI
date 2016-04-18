ko.bindingHandlers.slider = {
	init: function(element, bindings, allBindings, viewModel, bindingContext) {
		if(!bindingContext.$data.key) return;

		$(element).touchuiSlider({
				isBed: (bindingContext.$data.key() === "bed"),
				max: bindings().max,
				steps: bindings().steps,
				value: bindings().value(),
				enable: bindings().enable,
				points: [
					{name: "", bed: 0, extruder: 0},
					{name: "", bed: bindings().max, extruder: bindings().max}
				].concat(bindingContext.$root.temperature_profiles())
			})
			.on("changed", function(e, value) {
				bindings().value(value);
			});
	},
	update: function(element, bindings, allBindings, viewModel, bindingContext) {
		if(!bindingContext.$data.key) return;

		$(element).touchuiSlider('value', bindings().value());

		if(bindings().enable) {
			$(element).touchuiSlider('enable', true);
		} else {
			$(element).touchuiSlider('enable', false);
		}
	}
};
