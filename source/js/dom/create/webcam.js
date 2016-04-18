TouchUI.prototype.DOM.create.webcam = {

	menu: {
		webcam: {
			cloneTo: "#control_link"
		}
	},

	container: {
		cloneTo: ".tab-content",

		webcam: {
			$container: $("#webcam_container"),
			cloneTo: "#webcam"
		}
	},

	init: function( tabbar ) {
		var self = this;

		this.container.$elm = $('<div id="webcam" class="tab-pane"></div>')
			.appendTo(this.container.cloneTo);

		this.menu.webcam.$elm = tabbar.createItem("webcam_link", "webcam", "tab")
			.insertAfter(this.menu.webcam.cloneTo);

		this.menu.webcam.$elm.children()
			.html('<span>Webcam</span>');

		this.container.webcam.$container.next().appendTo(this.container.webcam.cloneTo);
		this.container.webcam.$container.prependTo(this.container.webcam.cloneTo);

		$('<!-- ko allowBindings: false -->').insertBefore(this.container.$elm);
		$('<!-- /ko -->').insertAfter(this.container.$elm);

		$("#webcam_container").attr("data-bind", $("#webcam_container").attr("data-bind").replace("keydown: onKeyDown, ", ""));

	}

}
