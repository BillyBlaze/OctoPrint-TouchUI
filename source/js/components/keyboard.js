TouchUI.prototype.components.keyboard = {

	isActive: ko.observable(false),
	config: {

		default: {
			usePreview: false,
			autoAccept: true,

			display: {
				'accept' :  'Save',
				'bksp'   :  ' ',
				'default': 'ABC',
				'meta1'  : '.?123',
				'meta2'  : '#+='
			},

			layout: 'custom',
			customLayout: {
				'default': [
					'q w e r t y u i o p',
					'a s d f g h j k l',
					'{bksp} {s} z x c v b n m',
					'{accept} {c} {left} {right} {meta1} {space}'
				],
				'shift': [
					'Q W E R T Y U I O P',
					'A S D F G H J K L',
					'{bksp} {s} Z X C V B N M',
					'{accept} {c} {left} {right} {meta1} {space}'
				],
				'meta1': [
					'1 2 3 4 5 6 7 8 9 0',
					'- / : ; ( ) \u20ac & @',
					'{bksp} {meta2} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				],
				'meta2': [
					'[ ] { } # % ^ * + =',
					'_ \\ | ~ < > $ \u00a3 \u00a5',
					'{bksp} {meta1} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				]
			}

		},
		terminal: {
			usePreview: false,
			autoAccept: true,

			display: {
				'bksp'   :  ' ',
				'accept' : 'Save',
				'default': 'ABC',
				'meta1'  : '.?123',
				'meta2'  : '#+='
			},

			layout: 'custom',
			customLayout: {
				'default': [
					'Q W E R T Y U I O P',
					'A S D F G H J K L',
					'{bksp} {s} Z X C V B N M',
					'{accept} {c} {left} {right} {meta1} {space}'
				],
				'meta1': [
					'1 2 3 4 5 6 7 8 9 0',
					'- / : ; ( ) \u20ac & @',
					'{bksp} {meta2} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				],
				'meta2': [
					'[ ] { } # % ^ * + =',
					'_ \\ | ~ < > $ \u00a3 \u00a5',
					'{bksp} {meta1} . , ? ! \' "',
					'{accept} {c} {left} {right} {default} {space}'
				]
			}

		},
		number: {
			usePreview: false,
			autoAccept: true,

			display: {
				'bksp'   :  ' ',
				'a'      :  'Save',
				'c'      :  'Cancel'
			},

			layout: 'custom',
			customLayout: {
				'default' : [
					'{bksp} 1 2 3 4 5 6 7 ',
					'{accept} {c} 8 9 0 - , . '
				]
			},
		}


	},

	init: function() {
		var self = this;

		// Add virtual keyboard
		var obj = {
			visible: self.components.keyboard.onShow.bind(self),
			beforeClose: self.components.keyboard.onClose
		};

		var notThis = ['[type="file"]','[type="checkbox"]','[type="radio"]'];
		$(document).on("mousedown", 'input:not('+notThis+'), textarea', function(e) {
			var $elm = $(e.target);

			if(!self.components.keyboard.isActive()) {

				if($elm.data("keyboard")) {
					$elm.data("keyboard").close().destroy();
				}

			} else {
				// $elm already has a keyboard
				if($elm.data("keyboard")) {
					$elm.data('keyboard').reveal();
					return;
				}

				if($elm.attr("type") === "number") {
					$elm.keyboard($.extend(self.components.keyboard.config.number, obj));
				} else if($elm.attr("id") === "terminal-command") {
					$elm.keyboard($.extend(self.components.keyboard.config.terminal, obj));
				} else {
					$elm.keyboard($.extend(self.components.keyboard.config.default, obj));
				}
			}

		});
	},

	onShow: function(event, keyboard, el) {
		var self = this;

		keyboard.$keyboard.find("button").on("mousedown, touchstart", function(e) {
			var $elm = $(e.target);
			$elm.addClass("touch-focus");

			if($elm.data("timeout")) {
				clearTimeout($elm.data("timeout"));
			}

			var timeout = setTimeout(function() {
				$elm.removeClass("touch-focus").data("timeout", "");
			}, 1000);

			$elm.data("timeout", timeout);
		});

		if(!self.settings.hasTouch) {
			var height = keyboard.$keyboard.height();
			$('#page-container-main').css('padding-bottom', height);

			// Force iScroll to stop following the mouse (bug)
			self.scroll.currentActive._end(new Event('click'));
			setTimeout(function() {
				self.scroll.currentActive.scrollToElement(keyboard.$el[0], 200, 0, -30);
			}, 100);

		}
	},

	onClose: function(event, keyboard, el) {
		keyboard.$keyboard.find("button").off("mousedown, touchstart");
		$('#page-container-main').css('padding-bottom', 0);
	}

}
