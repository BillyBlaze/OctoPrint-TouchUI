!function ($) {

	$.fn.TouchUI.fullscreen = {

		ask: function() {
			var self = this;

			new PNotify({
				title: 'Fullscreen',
				text: 'Would you like to go fullscreen?',
				icon: 'glyphicon glyphicon-question-sign',
				type: 'info',
				hide: false,
				confirm: {
					confirm: true,
					buttons: [{
						text: 'Yes',
						addClass: 'btn-primary',
						click: function(notice) {
							$(document).fullScreen(true);
							notice.remove();
						}
					}, {
						text: 'No',
						click: function(notice) {
							$(document).trigger("fullscreenchange");
							notice.remove();
						}
					}]
				},
				buttons: {
					closer: false,
					sticker: false
				},
				history: {
					history: false
				}
			});

		}

	};

}(window.jQuery);
