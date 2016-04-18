TouchUI.prototype.components.material.sidenav = function() {
	var self = this;

	$('.tabbable > .tab-content').hammerPan({
		container: {
			size: $(window).width(),
		},
		target: $('#navbar'),
		block: $('#files'),
		width: 70,

		onStep: function(pos, elm, ev) {
			$(elm).removeClass('animate').css('min-width', pos);

			if (self.settings.hasTouch) {
				$('.octoprint-container').removeClass('animate').css('padding-left', pos);
			}

			if (ev.type == 'panend' || ev.type == 'pancancel') {
				$(elm).addClass('animate');
				if (self.settings.hasTouch) {
					$('.octoprint-container').addClass('animate');
				}
			}
		},

		onTap: function(pos, elm) {
			$(elm).addClass('animate')
				.data("panStart", 0)
				.css({
					'min-width': 0
				});

			if (self.settings.hasTouch) {
				$('.octoprint-container').addClass('animate').css('padding-left', 0);
			}
		}

	});

}
