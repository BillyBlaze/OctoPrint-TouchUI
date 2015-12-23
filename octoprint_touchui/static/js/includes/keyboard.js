!function ($) {

	$.fn.TouchUI.keyboard = {

		isActive: false,
		config: {

			default: {

				display: {
					'accept' :  "Save",
					'bksp'   :  " ",
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
				display: {
					'bksp'   :  " ",
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
				display: {
					'bksp'   :  " ",
					'a'      :  "Save",
					'c'      :  "Cancel"
				},

				layout: 'custom',
				customLayout: {
					'default' : [
						'{bksp} 1 2 3 4 5 6 7 ',
						'{accept} {c} {left} {right} 8 9 0 - , . '
					]
				},
			}


		},

		init: function() {
			var self = this;
			return;

			// Add virtual keyboard
			var obj = {
				visible: self.keyboard.onShow,
				beforeClose: self.keyboard.onClose
			};

			// First check without delegation (trigger first)
			$("input, textarea").on("mousedown", function(e) {
				if(!self.keyboard.isActive) {
					var $elm = $(e.target);

					if($elm.data("keyboard")) {
						$elm.data("keyboard").destroy();
					}

					e.stopPropagation();
				}
			});

			// First check with delegation (trigger later)
			var notThis = ['[type="file"]','[type="checkbox"]','[type="radio"]'];
			$(document).on("mousedown", 'input:not('+notThis+'), textarea', function(e) {
				var $elm = $(e.target);

				// $elm already has a keyboard
				if($elm.data("keyboard")) {
					return;
				}

				if($elm.attr("type") === "number") {
					$elm.keyboard($.extend(self.keyboard.config.number, obj));
				} else if($elm.attr("id") === "terminal-command") {
					$elm.keyboard($.extend(self.keyboard.config.terminal, obj));
				} else {
					$elm.keyboard($.extend(self.keyboard.config.default, obj));
				}

				if(!self.isTouch) {
					self.scroll.currentActive.scrollToElement($elm[0], 200);
				}

			});
		},

		onShow: function(event, keyboard, el) {
			keyboard.$keyboard.find("button").on("mousedown", function(e) {
				$(e.target).addClass("touch-focus");

				if(typeof $(e.target).data("timeout") !== "function") {
					clearTimeout($(e.target).data("timeout"));
				}
				var timeout = setTimeout(function() {
					$(e.target).removeClass("touch-focus").data("timeout", "");
				}, 600);
				$(e.target).data("timeout", timeout);
			});
		},

		onClose: function(event, keyboard, el) {
			keyboard.$keyboard.find("button").off("mousedown");
		}

	};

}(window.jQuery);
