TouchUI.prototype.components.slider = {

	init: function() {

		ko.bindingHandlers.slider = {
			init: function (element, valueAccessor) {
				var $element = $(element);

				// Set value on input field
				$element.val(valueAccessor().value());

				// Create container
				var div = $('<div class="slider-container"></div>').insertBefore(element);

				// Wait untill next DOM bindings are executed
				setTimeout(function() {
					var $button = $(element).next('button');

					$button.appendTo(div);
					$element.appendTo(div);

					var lbl = $('<label for="ui-inp-" style="display: inline-block;">' + $button.text().split(":")[0].replace(" ", "") + ':</label>');
					lbl.appendTo('.octoprint-container')
					$element.attr("style", "padding-left:" + (lbl.width() + 15) + "px");
					lbl.appendTo(div);

				}, 60);

				$element.on("change", function(e) {
					valueAccessor().value($element.val());
				}).attr({
					max: valueAccessor().max,
					min: valueAccessor().min,
					step: valueAccessor().step,
				});

			},
			update: function (element, valueAccessor) {
				$(element).val(valueAccessor().value());
			}
		};

	}

}
