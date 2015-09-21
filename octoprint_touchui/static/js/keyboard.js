window.TouchUI = window.TouchUI || {};
window.TouchUI.keyboard = {
	init: function() {
		
		function onShow(event, keyboard, el) {
			
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
		}
		function onClose(event, keyboard, el) {
			keyboard.$keyboard.find("button").off("mousedown");
		}
		
		$(document).on("click", "#jog_distance", function(e) {
			$("#jog_distance").toggleClass("open");
		});
	
		$('input[type="number"]').keyboard({
			
			visible: onShow,
			beforeClose: onClose,
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
		});
		
		$('#terminal-command').keyboard({

			visible: onShow,
			beforeClose: onClose,
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

		});
		
		$('input[type="text"]:not("#terminal-command"), input[type="password"], textarea').keyboard({

			visible: onShow,
			beforeClose: onClose,
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

		});
		
		
	}
};