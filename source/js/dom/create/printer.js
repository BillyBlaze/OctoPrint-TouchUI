TouchUI.prototype.DOM.create.printer = {

	menu: {
		cloneTo: "#tabs"
	},

	container: {
		cloneTo: "#temp"
	},

	move: {
		$state: $("#state_wrapper"),
		$files: $("#files_wrapper")
	},

	init: function( tabbar ) {
		this.menu.$elm = tabbar.createItem("print_link", "printer", "tab").prependTo(this.menu.cloneTo);
		this.container.$elm = $('<div id="printer" class="tab-pane active"><div class="row-fluid"></div></div>').insertBefore(this.container.cloneTo);

		// Move the contents of the hidden accordions to the new print status and files tab
		this.move.$state.appendTo(this.container.$elm.find(".row-fluid"));
		this.move.$files.insertAfter(this.container.$elm.find(".row-fluid #state_wrapper"));

		// Create an upload button in the header
		$('<div class="upload-trigger accordion-heading-button btn-group" data-bind="enable: $root.loginState.isUser(), css: {disabled: !$root.loginState.isUser()}">' +
			'<a href="#" title="' + $('.upload-buttons .fileinput-button:first-child > span').text()  +'">' +
				'<i class="fa fa-upload"></i>' +
			'</a>' +
		'</div>')
			.appendTo('#files_wrapper .accordion-heading')
			.find('a[href="#"]')
			.on('click', function(e) {
				e.preventDefault();
				$('#gcode_upload').click();
			});
	}

}
