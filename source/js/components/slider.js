TouchUI.prototype.components.slider = {

	init: function() {

		// Destroy bootstrap control sliders
		$('#control .slider').each(function(ind, elm) {
			var $elm = $(elm),
				$next = $(elm).next(),
				obj = JSON.parse('{'+$elm.find("input").attr("data-bind").replace(/'/g, "").replace(/([a-zA-Z]+)/g,'"$1"')+"}"),
				text = $next.text().split(":")[0].replace(" ", ""),
				valKey = obj.slider.value;

			delete obj.slider.value;
			delete obj.slider.tooltip;

			$elm.addClass("hidden");

			var div = $('<div class="slider-container"></div>').insertAfter($elm);

			$elm.appendTo(div);
			$next.appendTo(div);

			$('<input type="number" id="ui-inp-'+ind+'">')
				.attr("data-bind", "enable: isOperational() && loginState.isUser(), value: " + valKey)
				.attr(obj.slider)
				.appendTo(div);

			$('<label for="ui-inp-'+ind+'"></label>')
				.appendTo(div)
				.text(text + ":");
		});

	}

}
