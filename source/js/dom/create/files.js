TouchUI.prototype.DOM.create.files = {

	menu: {
		cloneTo: "#temp_link"
	},

	container: {
		cloneTo: "#temp"
	},

	move: {
		$files: $("#files_wrapper")
	},

	init: function( tabbar ) {
		var self = this;

		// Create navbar item
		this.DOM.create.files.menu.$elm = tabbar.createItem("files_link", "files", "tab")
			.insertAfter(this.DOM.create.files.menu.cloneTo);

		// Hijack files id :)
		$('#files').attr('id', 'files-inner');

		// Create main container
		this.DOM.create.files.container.$elm = $('<div id="files" class="tab-pane"><div class="row-fluid"></div></div>')
			.insertBefore(this.DOM.create.files.container.cloneTo);

		// Move the contents of the hidden accordions to the new print status and files tab
		this.DOM.create.files.move.$files.appendTo("#files .row-fluid");

		$('<div class="switch-view"><a href="#"><span class="icon-wrench"/></a></div>').insertAfter('.sd-trigger')
			.find('a')
			.on("click", function(e) {
				e.preventDefault();
				self.DOM.create.files.container.$elm.toggleClass("condensed");

				if (!self.settings.hasTouch) {
					setTimeout(self.scroll.currentActive.refresh.bind(self.scroll.currentActive), 400);
				}
			});

		// Create FAB
		this.DOM.create.files.FAB();
	},

	FAB: function() {

		// Create FAB
		var $fab = $('<div/>').attr("class", "fab")
			.attr("id", "fab");

		// Toggle
		var $fabLink = $('<a href="#" class="toggle"></a>').appendTo($fab)
			.on("click", function(e) {
				e.preventDefault();
				$fab.toggleClass('active');
			});

		// Move buttons
		var $fabInner = $('.upload-buttons').attr("class", "fab-inner")
			.appendTo($fab);

		// Move Refresh
		$('.refresh-trigger').addClass('btn')
			.appendTo($fabInner);

		// Move progressbar
		$('#gcode_upload_progress').appendTo($fabLink);

		// Add to DOM
		$fab.appendTo('.octoprint-container');

		// Show FAB if tab is active
		this.menu.$elm.on("shown", function() {
			$('#fab').addClass('show');
		});
	}

}
