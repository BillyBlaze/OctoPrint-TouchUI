TouchUI.prototype.components.touchList = {
	init: function() {
		var self = this;

		$('#files').hammerPan({
			container: {
				size: $(window).width(),
			},
			block: $('.tabbable > .tab-content'),
			target: ['target', '.entry'],
			width: 70,
			reverse: true,
			onStep: function(pos, elm) {
				var translate = 'translate3d(' + pos + 'px, 0, 0)';

				$(elm).css({
					transform: translate,
					mozTransform: translate,
					webkitTransform: translate
				});
			}
		});

	}

}
