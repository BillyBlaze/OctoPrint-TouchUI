TouchUI.prototype.DOM.create.temperature = {

	menu: {
	},

	container: {
	},

	move: {
	},

	init: function() {
		var self = this;

		_.each(['foreach: tools', 'with: bedTemp'], function(key) {
			$('<!-- ko ' + key + ' -->' +
				'<div class="circle" data-bind="circle: { actual: actual, target: target }, slider: { max: ' + ((key === "with: bedTemp") ? '150, steps: 0.8' : '310, steps: 0.1') + ', value: target, enable: $root.isOperational() && $root.loginState.isUser() }' +
					((key === "with: bedTemp") ? ', visible: $parent.hasBed' : '') +'">' +
					'<span data-bind="html: name()"></span>' +
					'<div class="inner">' +
						'<span data-bind="html: actual() > 1 ? Math.floor(actual()) + \'°C\' : \'off\', visible: (actual() > 1)"></span>' +
						'<span data-bind="html: target() > 1 ? Math.floor(target()) + \'°C\' : \'off\'"></span>' +
					'</div>' +
				'</div>' +
				'<!-- /ko -->').appendTo("#temp");
		});

	}

}
