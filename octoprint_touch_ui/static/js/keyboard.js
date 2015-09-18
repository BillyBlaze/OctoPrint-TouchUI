window.TouchUI = window.TouchUI || {};
window.TouchUI.keyboard = {
	init: function() {
	
		$('input[type="number"]').keyboard({
			layout: 'custom',

			display: {
				'bksp'   :  "\u2190",
				'a'      :  "Save",
				'c'      :  "Cancel"
			},
			customLayout: {
				'default' : [
					'1 2 3 4 5 6 7 8 9 0 {bksp}',
					'- , . {left} {right} {a} {c}'
				]
			},
		});
		
		$('#terminal-command').keyboard({

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
					'{meta1} {space} {c} {accept}'
				],
				'meta1': [
					'1 2 3 4 5 6 7 8 9 0 {bksp}',
					'- / : ; ( ) \u20ac & @',
					'{meta2} . , ? ! \' " {meta2}',
					'{default} {space} {c} {accept}'
				],
				'meta2': [
					'[ ] { } # % ^ * + = {bksp}',
					'_ \\ | ~ < > $ \u00a3 \u00a5',
					'{meta1} . , ? ! \' " {meta1}',
					'{default} {space} {c} {accept}'
				]
			}

		});
		
		$('input[type="text"]:not("#terminal-command"), input[type="password"], textarea').keyboard({

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
					'{meta1} {space} {c} {accept}'
				],
				'shift': [
					'Q W E R T Y U I O P {bksp}',
					'A S D F G H J K L',
					'{s} Z X C V B N M ! ? {s}',
					'{meta1} {space} {c} {accept}'
				],
				'meta1': [
					'1 2 3 4 5 6 7 8 9 0 {bksp}',
					'- / : ; ( ) \u20ac & @',
					'{meta2} . , ? ! \' " {meta2}',
					'{default} {space} {c} {accept}'
				],
				'meta2': [
					'[ ] { } # % ^ * + = {bksp}',
					'_ \\ | ~ < > $ \u00a3 \u00a5',
					'{meta1} . , ? ! \' " {meta1}',
					'{default} {space} {c} {accept}'
				]
			}

		});
	}
};