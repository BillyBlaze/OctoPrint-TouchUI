!function() {

	var scrolled = false,
		timeout;

	$(window).on("scroll", function(ev) {
		scrolled = true;

		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(function() {
			scrolled = false;
		}, 100);
	});

	function pan(opts) {

		var options = Hammer.assign({
			Pan: {
				direction: Hammer.DIRECTION_HORIZONTAL,
				threshold: 5
			},
			Tap: {},
			container: {
				size: 70,
			},
			block: null,
			target: $('#navbar'),
			width: 70,
			start: 0,
			onStep: function() {},
			onTap: function() {}
		}, opts);

		if (options.reverse) {
			options.width = -options.width;
		}

		var instance = new Hammer.Manager(options.elms[0], {
			recognizers: [
				[Hammer.Pan, options.Pan],
				[Hammer.Tap, options.Tap]
			]
		});

		instance.on("panstart", function(ev) {
			var $target = $(ev.target);

			if (options.block) {
				if (scrolled || options.block.data("hammer.pan") && options.block.data("hammer.pan").options.isMoving === 1) {
					return;
				}
				if (TouchUI.prototype.scroll.iScrolls.body && TouchUI.prototype.scroll.iScrolls.body.directionLocked === "v") {
					return;
				}
			}

			if(options.target[0] === 'target') {
				options.elm = $target.parents(options.target[1]).get(0) || false;
				options.elm = (!options.elm && $target.is(options.target[1])) ? $target[0] : options.elm;
				options.width = ($(options.elm).find('.action-buttons').children().length < 5) ? 106 : 219;

				if (options.reverse) {
					options.width = -options.width;
				}
			} else {
				options.elm = options.target.get(0) || false;
			}

			$(options.elm).removeClass('animate');
		});

		instance.on("panmove panend pancancel", function(ev) {

			if (options.block) {
				if (scrolled || options.block.data("hammer.pan") && options.block.data("hammer.pan").options.isMoving === 1) {
					return;
				}
				if (TouchUI.prototype.scroll.iScrolls.body && TouchUI.prototype.scroll.iScrolls.body.directionLocked === "v") {
					return;
				}
			}

			if(options.elm) {
				var start = $(options.elm).data("panStart") || 0;
				var percent = (100 / options.container.size) * ev.deltaX;
				var pos = (options.container.size / 100) * percent;
				pos = (!start) ? pos : start + pos;

				if (ev.type == 'panend' || ev.type == 'pancancel') {
					if (!start) {
						pos = (pos > (options.width * 0.4)) ? options.width : 0;
					} else {
						pos = (pos < (options.width * 0.6)) ? 0 : options.width;
					}

					if (options.reverse) {
						pos = (!pos) ? options.width : 0;
					}
					$(options.elm).data("panStart", pos);
				}

				if (!options.reverse) {
					pos = Math.max(0, Math.min(options.width, pos));
				} else {
					pos = Math.max(options.width, Math.min(0, pos));
				}

				if (pos < -options.Pan.threshold || pos > options.Pan.threshold) {
					instance.set({ isMoving: 1 });
				}

				options.onStep.call(instance, pos, options.elm, ev);

				if (ev.type == 'panend' || ev.type == 'pancancel') {
					setTimeout(function() {
						instance.set({ isMoving: 0 });
					}, 10);
				}
			}

		});

		instance.on("tap", function(ev) {
			options.onTap.call(instance, ev, options.elm);
		});

		$(options.elms[0]).data("hammer.pan", instance);

	};

	$.fn.hammerPan = function(options) {
		options.elms = this;
		new pan(options);
		return this;
	};

}();
