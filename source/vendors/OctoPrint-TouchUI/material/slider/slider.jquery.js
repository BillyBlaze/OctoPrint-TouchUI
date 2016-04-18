(function($) {

	function decimalAdjust(value, inc) {
		return Math.ceil(value/inc)*inc;
	}

	function Slider(config) {
		this.startup(config);
		this.init();
	}

	Slider.prototype = {

		parent: "#dashboard > .inner",
		steps: 0.4,
		value: 0,
		initValue: 0,

		startup: function(config) {
			$.extend(this, config);

			var self = this;
			var start = false;
			var namespace = ".touchui.slider";

			this.initValue = this.value;

			this.$slider = $('<div class="slidert"></div>').insertBefore(this.$elm);
			this.$grid = $('<div class="grid"></div>').appendTo(this.$slider);
			this.$hightlight = $('<div class="highlight"></div>').appendTo(this.$grid);
			this.$input = $('<div class="input"><input type="number"></div>')
				.appendTo(this.$slider)
				.find('input')
				.on("change", function(e) {
					self.setValue(self.$input.val());
				})
				.val(self.value);

			this.$confirm = $('<div class="confirm"></div>')
				.appendTo(this.$hightlight)
				.on("click", function() {
					self.$elm.trigger("changed", self.value);
					self.$slider.removeClass('confirmValue');
				});

			this.$error = $('<div class="error"></div>')
				.appendTo(this.$hightlight)
				.on("click", function() {
					self.$slider.removeClass('confirmValue');
				});

			this.$fake = $('<div class="fake"></div>').appendTo(this.$grid)
				.on("click"+namespace, function(e) {
					var progress = (e.offsetX / self.$fake.width()) * self.max;
					self.setValue(Math.round(progress));
					self.confirmValue();
				});

			this.$knob = $('<div class="knob"></div>')
				.appendTo(this.$grid)
				.on("mousedown"+namespace+" touchstart"+namespace, function(e) {
					var width = parseFloat(self.$grid.width());
					try {
						start = e.pageX || e.originalEvent.targetTouches[0].pageX;
					} catch(err) {}

					var startPoint = ((parseFloat(self.$knob.css("left")) || 0) / width) * 100;

					$(document)
						.on("mousemove"+namespace+" touchmove"+namespace, function(e) {
							if(start) {
								try {
									e.preventDefault();
									self.$knob.addClass("focus");

									var current = e.pageX || e.originalEvent.targetTouches[0].pageX;
									var progress = ((current - start) / width) * 100;

									progress = decimalAdjust(parseFloat(progress + startPoint), self.steps) || 0;

									self.setValue(Math.round(self.max * (progress / 100)));

								} catch(err) {}
							}

						})
						.on("mouseup"+namespace+" touchend"+namespace, function(e) {
							self.$knob.removeClass("focus");
							start = false;
							$(document).off(namespace);

							self.confirmValue();
						});
				});

				_.each(self.points, function(elm) {
					$('<div class="hotpoint"><span>'+elm.name+'</span></div>')
						.appendTo(self.$grid)
						.css('left', (((self.isBed) ? elm.bed / self.max : elm.extruder / self.max) * 100)+"%")
						.on('click', function() {
							self.setValue((self.isBed) ? elm.bed : elm.extruder);
							self.confirmValue();
						});
				});

				self.setValue(self.value);

		},

		init: function() {
			var self = this;
			var $elm = this.$elm;
			var $slider = this.$slider;
			var namespace = ".touchui.slider-click";

			$elm
				.off("click"+namespace)
				.on("click"+namespace, function(e) {

					$('.slidert')
						.removeClass('done')
						.removeClass('active')
						.removeClass('moving');

					$('.circle.active')
						.removeClass('active');

					$slider
						.addClass('moving');

					self.setPosition();

					setTimeout(function() {

						$slider.removeClass('moving');
						$elm.addClass('active');

						$slider
							.addClass('active')
							.one("animationend webkitAnimationEnd oAnimationEnd", function() {
								$slider.css({
									left: 0,
									right: 0
								});
							})
							.one("transitionend webkitTransitionEnd oTransitionEnd", function() {
								$slider.addClass('done');
							});

						$(document).on("mousedown"+namespace+" touchstart"+namespace, function(e) {
							if (!$(e.target).is(self.$slider) && $(e.target).parents('.slidert.active').length === 0) {
								$('.slidert.active').removeClass('active');
								$('.circle.active').removeClass('active');

								$(document).off(namespace);
								$(window).off(namespace);
							}
						});

						$(window).on("resize"+namespace, function() {
							self.setPosition(true);
						});

					}, 10);
				});

			self.setEnable(self.enable);
		},

		confirmValue: function() {
			this.$slider.addClass('confirmValue');
		},

		setPosition: function(topOnly) {
			var offset = this.$elm.position();
			offset.right = $(this.parent).outerWidth() - (offset.left + this.$elm.outerWidth());

			if(topOnly) {
				delete offset.right;
				delete offset.left;
			}

			this.$slider.css(offset);
		},

		setValue: function(value) {
			value = Math.max(0, Math.min(value, this.max));

			this.$knob.css('left', ((value / this.max) * 100) + "%");
			this.$hightlight.width(((value / this.max) * 100) + "%");
			// this.$label.find('span').text(value);
			this.$input.val(value);
			this.value = value;
		},

		setEnable: function(enable) {

			if (enable) {
				this.$slider.removeClass("disabled");
			} else {
				this.$slider.addClass("disabled");
			}

			self.enable = enable;
		},

		cofirmValue: function() {
			this.$elm.trigger("changed", this.value);
		}

	};

	$.fn.touchuiSlider = function(configOrCommand, commandArgument) {
		var dataName = 'slider',
			firstInstance = this.data(dataName);

		if (configOrCommand == 'value') {
			if (!firstInstance)
				throw Error('Calling "value" method on not initialized instance is forbidden');
			if (typeof commandArgument == 'undefined') {
				return firstInstance.getValue();
			} else {
				var newValue = arguments[1];
				return this.each(function() {
					var instance = $(this).data(dataName);

					if(instance.initValue === newValue) return;
					instance.initValue = newValue;
					instance.setValue(newValue);
				});
			}
		}

		if (configOrCommand == 'enable') {
			if (!firstInstance)
				throw Error('Calling "value" method on not initialized instance is forbidden');
			if (typeof commandArgument == 'undefined') {
				return firstInstance.enable;
			} else {
				var newValue = arguments[1];
				return this.each(function() {
					return $(this).data(dataName).setEnable(newValue);
				});
			}
		}

		return this.each(function() {
			var el = $(this),
				instance = el.data(dataName),
				config = $.isPlainObject(configOrCommand) ? configOrCommand : {};

			if (instance) {
				instance.init(config);
			} else {
				var initialConfig = $.extend({}, el.data());
				config = $.extend(initialConfig, config);
				config.$elm = el;
				instance = new Slider(config);
				el.data(dataName, instance);
			}
		});
	};

})(jQuery);
