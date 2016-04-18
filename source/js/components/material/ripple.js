TouchUI.prototype.components.material.ripple = function() {

	$('<div id="navbar-waves"></div>').on("click", function(e) {
		$('#all_touchui_settings > a').click();
	}).appendTo('#navbar .navbar-inner .container');

	var $ripple = $('button, a.btn, .nav li:not(#all_touchui_settings) a, #navbar-waves');
	$ripple.each(function touchUiRippleManipulate(ind, elm) {
		var $elm = $(elm);
		var html = $elm.html().trim();

		if (html && html.indexOf("</") === -1) {
			$elm.empty();
			$('<span/>').text(html).appendTo($elm);
		}

		$elm.addClass("waves-effect")
			.on("click", function(e) {
				var $target = $(e.target);
				if (
					$target.parents('#navbar').length &&
					!$target.parents('#all_touchui_settings').length &&
					$target.attr("id") !== "navbar-waves" ||
					$target.parents('.tabs-mirror').length
				) {
					$('.is-active').removeClass('is-active');
					setTimeout(function() {
						$elm.addClass('is-active');
					}, 200);
				}
			});

	});
/*
	$('.brand').click(function(e) {
		e.preventDefault();
		var navbar = $('#navbar-waves')[0];

		var mousedown = new MouseEvent("mousedown", e.originalEvent);
		var mouseup = new MouseEvent("mouseup", e.originalEvent);
		var click = new MouseEvent("click", e.originalEvent);

		navbar.dispatchEvent(mousedown);
		setTimeout(function() {
			navbar.dispatchEvent(mouseup);
			$('#navbar-waves').click();
		}, 0);
	});

	$('#all_touchui_settings > a').on('mousedown touchstart', function(e) {
		e.stopPropagation();
		e.preventDefault();

		var navbar = $('#navbar-waves')[0];
		e.originalEvent.target = navbar;

		var mousedown = new MouseEvent("mousedown", e.originalEvent);
		var mouseup = new MouseEvent("mouseup", e.originalEvent);
		var click = new MouseEvent("click", e.originalEvent);

		navbar.dispatchEvent(mousedown);
		setTimeout(function() {
			navbar.dispatchEvent(mouseup);
			$('#navbar-waves').click();
		}, 0);

		return false;
	});*/
}
