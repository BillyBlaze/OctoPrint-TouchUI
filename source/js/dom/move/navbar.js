TouchUI.prototype.DOM.move.navbar = {
	mainItems: ['#all_touchui_settings'/*, '#navbar_plugin_navbartemp', '#navbar_login', '#navbar_systemmenu','.hidden_touch'*/],
	init: function() {

		var self = this;
		var _each = function(ind, elm) {
			var $elm = $(elm);
			var $clone = $elm.clone()
				.appendTo(self.DOM.create.dropdown.container);

			$clone.children('> a')
				.text($elm.text().trim());

			if (this.mirror) {
				$clone.attr("id", $clone.attr("id") + "_mirror")
					.addClass("tabs-mirror")
					.children('a')
					.on("click", function(e) {
						e.preventDefault();
						e.stopPropagation();

						$elm.children('a').trigger("click", e);
					});
			} else {
				$elm.remove();
			}

		};

		var $tabs = $("#tabs > li");
		var $navbar = $("#navbar ul.nav > li:not("+this.DOM.move.navbar.mainItems+")");
		$tabs.each(_each.bind({ mirror: true }));
		$navbar.each(_each.bind({ mirror: false }));

		// Move TouchUI to main dropdown
		$("#navbar_plugin_touchui").insertAfter("#navbar_settings");

		// Create and Move login form to main dropdown
		$('<li><ul id="youcanhazlogin"></ul></li>').insertAfter("#navbar_plugin_touchui");

		$('#navbar_login').appendTo('#youcanhazlogin')
			.find('a.dropdown-toggle')
			.text($('#youcanhazlogin')
			.find('a.dropdown-toggle')
			.text().trim());

		// Move the navbar temp plugin
		this.plugins.navbarTemp.call(this);

		// $('<div id="touchui_toggle_menu"><i class="fa fa-bars"></i></div>').appendTo('body').click(function() {
		// 	$('#all_touchui_settings > a').click();
		// });

		// Remove all text in the buttons
		var $items = $("#tabs > li > a");
		$items.each(function(ind, elm) {
			$(elm).text("");
		}.bind(this));

		// Set text on empty dropdown item
		$('#files_link_mirror a').html('<span>'+$('#files_wrapper .accordion-toggle').text().trim()+'</span>');

		$("#temp_link_mirror a").html('<span>' + $('#temp_link_mirror a').text() + '</span>')
			.find('span')
			.attr('data-bind', "text: appearance.name() == '' ? appearance.title : appearance.name");

		// Add hr before the settings icon
		$('<li class="divider"></li>').insertBefore("#navbar_settings");

		$('<li class="divider" id="divider_systemmenu" style="display: none;"></li>').insertBefore("#navbar_systemmenu")
			.attr("data-bind", $("#navbar_systemmenu").attr("data-bind"));

		// Dynamicly hide icons that don't fit on screen, and show the mirror
		$(window).on('resize', function(e) {
			var cutOff = 0.5;
			var itemHeight = $("#all_touchui_settings").height();
			var height = $(window).innerHeight() - (itemHeight - (itemHeight * cutOff));
			var $items = $('#tabs > li');
			var fitOnScreen = Math.floor(height / itemHeight);

			$items.slice(0, fitOnScreen).removeClass("hidden");
			$('.tabs-mirror').addClass("hidden");

			$items.slice(fitOnScreen).each(function(ind, elm) {
				$(elm).addClass("hidden");
				$("#" + $(elm).attr("id") + "_mirror").removeClass("hidden");
			});
		});

		// Force first calculation
		setTimeout(function touchUiResize() {
			$(window).trigger('resize');
		}, 0);

	}

}
