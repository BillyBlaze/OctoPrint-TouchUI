TouchUI.prototype.DOM.create.dashboard = {

	container: {
		cloneTo: "#temp"
	},

	move: {
		$state: $("#state_wrapper")
	},

	init: function( tabbar ) {

		// Create dashboard
		var $dashboard = $('<div id="dashboard" class="tab-pane active"><div class="inner"></div></div>')
			.insertBefore(this.container.cloneTo);

		this.move.$state
			.appendTo($dashboard.find('.inner'));

		$dashboard.find(".accordion-toggle")
			.attr("data-bind", "text: appearance.name() == '' ? appearance.title : appearance.name");

		$(this.container.cloneTo)
			.appendTo($dashboard.find('.inner'))
			.attr("class", "");

		$("#temp_link a")
			.attr("href", "#dashboard")
			.addClass("is-active");

		var $wrapper = $("#state_wrapper .accordion-heading").prependTo($dashboard);
		$("#job_cancel").html('<i class="icon-stop"></i>');
		$wrapper.find('a').text("");
		$('.print-control').appendTo($wrapper);

		$("#temperature-graph").appendTo($dashboard);

	}

}
