TouchUI.prototype.DOM.create.webcam = {

	menu: {
		webcam: {
			cloneTo: "#term_link"
		}
	},

	container: {
		cloneTo: "#timelapse",

		webcam: {
			$container: $("#webcam_container"),
			cloneTo: "#webcam"
		}
	},

	init: function( tabbar ) {
		var self = this;

		this.container.$elm = $('<div id="webcam" class="tab-pane"></div>').insertAfter(this.container.cloneTo);
		this.menu.webcam.$elm = tabbar.createItem("webcam_link", "webcam", "tab").insertBefore(this.menu.webcam.cloneTo);

		this.container.webcam.$container.next().appendTo(this.container.webcam.cloneTo);
		this.container.webcam.$container.prependTo(this.container.webcam.cloneTo);

		$('<!-- /ko -->').insertBefore(this.container.$elm);
		$('<!-- ko allowBindings: false -->').insertBefore(this.container.$elm);

		$("#webcam_container").attr("data-bind", $("#webcam_container").attr("data-bind").replace("keydown: onKeyDown, ", ""));

	}

}
