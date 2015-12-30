TouchUI.prototype.components.ask = function() {
	var self = this;

	if(['iPad', 'iPhone', 'iPod'].indexOf(navigator.platform) === -1) {
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
						notice.remove();
						$(document).fullScreen(true);
					}
				}, {
					text: 'No',
					click: function(notice) {
						notice.remove();
						$(document).trigger("fullscreenchange");
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

}
