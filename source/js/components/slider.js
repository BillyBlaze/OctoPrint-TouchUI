TouchUI.prototype.components.slider = {

	init: function() {

		// Destroy bootstrap control sliders
		$('#control .slider').each(function(ind, elm) {
			var $elm = $(elm);
			var $next = $(elm).next();
			var text = $next.text().split(":")[0].replace(" ", "");
			var sliderObj = ko.jsonExpressionRewriting.parseObjectLiteral($elm.find("input").attr("data-bind"));
			var obj = ko.jsonExpressionRewriting.parseObjectLiteral(sliderObj[0].value);
			var slider = {};

			_.each(obj, function(elm, ind) {
				slider[elm.key.trim()] = elm.value.trim();
			});

			var valKey = slider.value;
			delete slider.value;
			delete slider.tooltip;

			$elm.addClass("hidden");

			var div = $('<div class="slider-container"></div>').insertAfter($elm);

			$elm.appendTo(div);
			$next.appendTo(div);

			$('<input type="number" id="ui-inp-'+ind+'">')
				.attr("data-bind", "enable: isOperational() && loginState.isUser(), value: " + valKey)
				.attr(slider)
				.appendTo(div);

			$('<label for="ui-inp-'+ind+'"></label>')
				.appendTo(div)
				.text(text + ":");
		});

	}

}
