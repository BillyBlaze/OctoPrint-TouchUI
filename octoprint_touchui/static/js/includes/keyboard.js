!function ($) {

	$.fn.TouchUI.keyboard = {

		isActive: false,
		config: {

			default: {

				display: {
					'accept' :  "Save",
					'bksp'   :  "\u2190",
					'default': 'ABC',
					'meta1'  : '.?123',
					'meta2'  : '#+='
				},

				layout: 'custom',
				customLayout: {
					'default': [
						'q w e r t y u i o p {bksp}',
						'a s d f g h j k l',
						'{s} z x c v b n m , . {s}',
						'{left} {right} {meta1} {space} {c} {accept}'
					],
					'shift': [
						'Q W E R T Y U I O P {bksp}',
						'A S D F G H J K L',
						'{s} Z X C V B N M ! ? {s}',
						'{left} {right} {meta1} {space} {c} {accept}'
					],
					'meta1': [
						'1 2 3 4 5 6 7 8 9 0 {bksp}',
						'- / : ; ( ) \u20ac & @',
						'{meta2} . , ? ! \' " {meta2}',
						'{left} {right} {default} {space} {c} {accept}'
					],
					'meta2': [
						'[ ] { } # % ^ * + = {bksp}',
						'_ \\ | ~ < > $ \u00a3 \u00a5',
						'{meta1} . , ? ! \' " {meta1}',
						'{left} {right} {default} {space} {c} {accept}'
					]
				}

			},
			terminal: {
				display: {
					'bksp'   :  "\u2190",
					'accept' : 'Save',
					'default': 'ABC',
					'meta1'  : '.?123',
					'meta2'  : '#+='
				},

				layout: 'custom',
				customLayout: {
					'default': [
						'Q W E R T Y U I O P {bksp}',
						'A S D F G H J K L',
						'{s} Z X C V B N M ! ? {s}',
						'{left} {right} {meta1} {space} {c} {accept}'
					],
					'meta1': [
						'1 2 3 4 5 6 7 8 9 0 {bksp}',
						'- / : ; ( ) \u20ac & @',
						'{meta2} . , ? ! \' " {meta2}',
						'{left} {right} {default} {space} {c} {accept}'
					],
					'meta2': [
						'[ ] { } # % ^ * + = {bksp}',
						'_ \\ | ~ < > $ \u00a3 \u00a5',
						'{meta1} . , ? ! \' " {meta1}',
						'{left} {right} {default} {space} {c} {accept}'
					]
				}

			},
			number: {
				display: {
					'bksp'   :  "\u2190",
					'a'      :  "Save",
					'c'      :  "Cancel"
				},

				layout: 'custom',
				customLayout: {
					'default' : [
						'1 2 3 4 5 6 7 8 9 0 {bksp}',
						'- , . {left} {right} {a} {c}'
					]
				},
			}


		},

		init: function() {
			var self = this;

			// Toggle dropdown
			$(document).on("click", "#jog_distance", function(e) {
				$("#jog_distance").toggleClass("open");
			});

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
			$(document).on("mousedown", 'input:not([type="file"]), textarea', function(e) {
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
