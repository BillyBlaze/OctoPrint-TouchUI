ko.bindingHandlers.circle = {
	maths: function(actual, target) {

		if( target && target > 1 ) {
			return { progress: actual / target, target: target };
		} else if( !target && actual ) {
			return { progress: actual };
		}

		return { progress: 0 };

	},
	init: function(element, bindings, allBindings, viewModel, bindingContext) {
		var total = ko.bindingHandlers.circle.maths(bindings().actual(), bindings().target());
		var color = $("#navbar").css("background-color");

		$(element).circleProgress({
				value: 0.001,
				arcCoef: 0.7,
				size: 100,
				thickness: 8,
				lineCap: 'round',
				fill: { color: color }
			})
			.data("targetTemp", total.progress)
			.on("changed", function(e, value) {
				if (!value) {
					bindingContext.$parent.setTargetToZero(viewModel);
				} else {
					viewModel.newTarget(value);
					bindingContext.$parent.setTarget(viewModel);
				}
			});

	},
	update: function(element, bindings) {
		var $elm = $(element);
		var total = ko.bindingHandlers.circle.maths(bindings().actual(), bindings().target());
		var target = parseFloat($elm.data("targetTemp"));
		var setTo = (total.target) ? total.progress : (target) ? total.progress / target : 0;

		if (total.target) {
			$elm.data("targetTemp", total.target);
		}

		if (TouchUI.prototype.settings.colors) {
			$elm.data('circle-progress').arcFill = TouchUI.prototype.settings.colors.mainColor();
		}

		$elm.circleProgress('value', setTo)

	}
};
