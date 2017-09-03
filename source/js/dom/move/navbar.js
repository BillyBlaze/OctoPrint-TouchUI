TouchUI.prototype.DOM.move.navbar = {
	mainItems: ['#all_touchui_settings', '#navbar_plugin_navbartemp', '#navbar_login', /*'#navbar_systemmenu',*/ '.hidden_touch'],
	init: function() {

		var $items = $("#navbar ul.nav > li:not("+this.DOM.move.navbar.mainItems+")");
		$items.each(function(ind, elm) {
			var $elm = $(elm);
			$elm.appendTo(this.DOM.create.dropdown.container);

			if($elm.children('a').length > 0) {
				var elme = $elm.children('a')[0];

				$.each(elme.childNodes, function(key, node) {
					if(node.nodeName === "#text") {
						node.nodeValue = node.nodeValue.trim();
					}
				});
				
				if(!$(elme).text()) {
					$(elme).text($(elme).attr("title"));
				}
			}
		}.bind(this));

		// Move TouchUI to main dropdown
		$("#navbar_plugin_touchui").insertAfter("#navbar_settings");

		// Create and Move login form to main dropdown
		$('<li><ul id="youcanhazlogin"></ul></li>')
			.insertAfter("#navbar_plugin_touchui");
		
		$('#navbar_login')
			.appendTo('#youcanhazlogin')
			.find('a.dropdown-toggle')
			.text($('#youcanhazlogin').find('a.dropdown-toggle').text().trim())
			.attr("data-bind", "visible: !loginState.loggedIn()");
		
		// Create fake TouchUI tabbar and map it to the original dropdown
		$('<li id="touchui_dropdown_link"><a href="#"></a></li>').appendTo("#tabs");
		function resizeMenuItem() {
			var width = $('#touchui_dropdown_link').width();
			$('#all_touchui_settings').width(width);
			
			setTimeout(function() {
				var width = $('#touchui_dropdown_link').width();
				$('#all_touchui_settings').width(width);
			}, 600);
		}
		$(window).on('resize.touchui.navbar', resizeMenuItem);
		resizeMenuItem();

		// Move the navbar temp plugin
		this.plugins.navbarTemp.call(this);
		this.plugins.psuControl.call(this);

	}

}
