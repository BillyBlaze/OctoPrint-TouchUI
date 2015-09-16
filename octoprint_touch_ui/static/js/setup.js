$(function() {

	function touchUIViewModel(parameters) {
		var self = this;
		
		window.TouchUI = {};
		window.TouchUI.blockDropdownFromClosing = false;
		
		self.toggleTouchUI = function() {
			
		};
		
		self.onStartupComplete = function() {

			var settingsLabel = $("<span></span>").addClass("hidden").attr("id", "special-dropdown-uni").appendTo("#settings_dialog_label").text($("#settings_dialog_menu .active").text().trim()).on("click", function(e) {
				if(e.target !== this || (e.target === this && $(".show-dropdown").length > 0)) {
					return;
				}
				
				$("#settings_dialog_menu").clone().attr("id", "").appendTo(this).addClass("show-dropdown");
				$(document).on("click", function(event) {
					
					if(
						$(event.target).closest('[data-toggle="tab"]').length > 0 || //Check if we clicked on a tab-link
						$(event.target).closest("#special-dropdown-uni").length === 0 && //Check if we clicked outside the dropdown
						window.TouchUI.blockDropdownFromClosing === false
					) {
						var href = settingsLabel.find(".active").find('[data-toggle="tab"]').attr("href");
						$(document).off(event);
						
						$('.show-dropdown').remove();
						$('[href="'+href+'"]').click();
						settingsLabel.text($('[href="'+href+'"]').text());
					}
					
					window.TouchUI.blockDropdownFromClosing = false;
					
				});
			});
			
			$("#gcode_link").clone().attr("id", "gcode_link2").insertBefore("#login_dropdown_loggedin li:first-child").click(function(e) {
				e.preventDefault();
				e.stopPropagation();
				
				$("#gcode_link a").click();
			});
			$("#gcode_link").addClass("hidden_touch");
			
			$('<li id="print_link"><a href="#printer" data-toggle="tab"></a></li>').insertBefore("#tabs li:first-child");
			$('<div id="printer"><div class="row-fluid"></div></div>').addClass("tab-pane").insertBefore("#temp");
			$('#state_wrapper').appendTo("#printer .row-fluid");
			$('#files_wrapper').insertAfter("#printer .row-fluid #state_wrapper");
			
			setTimeout(function() {
				$('.gcode_files').slimScroll({destroy: true});
				$('.slimScrollDiv').slimScroll({destroy: true});
			}, 400);
			
			$(document).ready(function() {
				
				/* Add touch friendly files list */
				var touch = false,
					start = 0;
				$(document).on("mousedown touchstart", "#files .entry", function(e) {
					touch = e.currentTarget;
					start = e.pageX || e.originalEvent.targetTouches[0].pageX;
				});
				$(document).on("mouseup touchend", function(e) {
					touch = false;
					start = 0;
				});
				$(document).on("mousemove touchmove", function(e) {
					if(touch !== false) {
						var current = e.pageX || e.originalEvent.targetTouches[0].pageX;

						if(current > start + 80) {
							$(touch).removeClass("open");
							start = current;
						} else if(current < start - 80) {
							$(touch).addClass("open");
							start = current;
						}
						
					}
				});
				
				/* Add touch friendly slider for temps */
				$('#temp table tr[data-bind]').each(function(ind, elm) {
					var input = $(elm).find('input[type="text"]');
					
					var slider = $('<div class="circ-slider no-mouse-scroll"></div>').insertBefore("#temp table").CircularSlider({ 
						min: 0, 
						max: 280, 
						value: 0,
						labelSuffix: $(elm).find("td:last-child .add-on").text(),
						labelPrefix: "<b>" + $(elm).find("th:first-child").text() + "</b>",
						shape: "Half Circle",
						slide: function(ui, value) {
							if(!input.is("[disabled]")) {
								input.val(value).trigger("keyup");
							}
						}
					});
					
					input.change(function(e) {
						if(input.is("[disabled]")) {
							slider.addClass("disabled");
						} else if(!isNaN(parseFloat(input.val()))) {
							slider.removeClass("disabled");
							slider.value(parseFloat(input.val()));
						}
					});
					input.trigger("change");
				});
			});
		
			/* Remove drag files into website */
			$(document).off("dragover");
		
			/* Add body scrolling on mousedown if there is no touch events */
			if (!('ontouchstart' in window) && !('onmsgesturechange' in window)) {
				
				$('body,html').css('overflow', 'hidden');
				
				$('<div id="scroll"></div>').insertBefore('.page-container');
				$('.page-container').appendTo("#scroll");
				
				var scroll = new IScroll('#scroll', {
					scrollbars: true,
					mouseWheel: true,
					interactiveScrollbars: true,
					shrinkScrollbars: 'scale',
					fadeScrollbars: true
				});
				
				$('[data-toggle="tab"]').on("click", function() {
					scroll.stop();
					scroll.refresh();
					
					// TODO: Make this a setting in the options
					setTimeout(function() {
						scroll.scrollTo(0, -parseFloat($("#navbar").height()), 160);
						setTimeout(function() {
							scroll.refresh();
						}, 180);//crappy iScroll
					}, 100);

				});
				
				// Add scroll polyfill to modal
				var curDown = false,
					curYPos = 0,
					curXPos = 0,
					prev = {};

				$('.modal').mousedown(function(m){
					curDown = true;
					curYPos = m.pageY;
					curXPos = m.pageX;
				});
				
				$('.modal').mousemove(function(m){
					if(curDown === true){
						m.preventDefault();
						
						if($(m.target).parents('.modal').length > 0 || $(m.target).is(".modal")) {
							var target = $(m.target).parents('.modal')[0] || $(m.target);
							window.TouchUI.blockDropdownFromClosing = true;
							
							$(target).scrollTop($(target).scrollTop() + (curYPos - m.pageY)); 
							$(target).scrollLeft($(target).scrollLeft() + (curXPos - m.pageX));
							
							curYPos = m.pageY;
							curXPos = m.pageX;
							return;
						}
					}
				});

				$('.modal').mouseup(function(m, skip){
					curDown = false;
				});
				
			} else {
				
				/* Hide topbar if clicking an item */
				// TODO: Make this a setting in the options
				$('#tabs [data-toggle="tab"]').click(function() {
					$("html, body").stop().animate({scrollTop:parseFloat($("#navbar").height())}, 160, 'swing');
				});
				
			}
			
			$('input[type="number"]')
				.keyboard({
					layout: 'custom',

					display: {
						'bksp'   :  "\u2190",
						'a'      :  "Save",
						'c'      :  "Cancel"
					},
					customLayout: {
						'default' : [
							'1 2 3 4 5 6 7 8 9 0 {bksp}',
							' , . {left} {right} {a} {c}'
						]
					},
				});
			
			$('#terminal-command')
				.keyboard({

					display: {
						'accept' :  "Save",
						'bksp'   :  "\u2190",
						'accept' : 'Enter',
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
							'{meta1} {space} {meta1} {accept}'
						],
						'meta1': [
							'1 2 3 4 5 6 7 8 9 0 {bksp}',
							'- / : ; ( ) \u20ac & @',
							'{meta2} . , ? ! \' " {meta2}',
							'{default} {space} {default} {accept}'
						],
						'meta2': [
							'[ ] { } # % ^ * + = {bksp}',
							'_ \\ | ~ < > $ \u00a3 \u00a5',
							'{meta1} . , ? ! \' " {meta1}',
							'{default} {space} {default} {accept}'
						]
					}

				});
			
			$('input[type="text"]:not("#terminal-command"), input[type="password"], textarea')
				.keyboard({

					display: {
						'accept' :  "Save",
						'bksp'   :  "\u2190",
						'accept' : 'Enter',
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
							'{meta1} {space} {meta1} {accept}'
						],
						'shift': [
							'Q W E R T Y U I O P {bksp}',
							'A S D F G H J K L',
							'{s} Z X C V B N M ! ? {s}',
							'{meta1} {space} {meta1} {accept}'
						],
						'meta1': [
							'1 2 3 4 5 6 7 8 9 0 {bksp}',
							'- / : ; ( ) \u20ac & @',
							'{meta2} . , ? ! \' " {meta2}',
							'{default} {space} {default} {accept}'
						],
						'meta2': [
							'[ ] { } # % ^ * + = {bksp}',
							'_ \\ | ~ < > $ \u00a3 \u00a5',
							'{meta1} . , ? ! \' " {meta1}',
							'{default} {space} {default} {accept}'
						]
					}

				});
			
		};
		
/*		$(window).resize(function() {
			var plot = $("#temperature-graph").data("plot");
			
			plot.resize();
		});*/
		

		$("html").attr("id", "touch");
		$('<link href="//maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet"></link>').appendTo("head");
		$('<meta name="viewport" content="width=device-width, initial-scale=1"/>').appendTo("head");
		$('<script></script>').appendTo("head").attr("src", "http://192.168.1.12:8008/target/target-script-min.js#anonymous");
		
		
		var tmp = $("#navbar_settings").clone().attr("id", "navbar_settings2");
		var tmp2 = tmp.find("#navbar_show_settings").attr("data-bind", "").attr("id", "");
		
		tmp.insertBefore("#login_dropdown_loggedin li:first-child");
		tmp2.click(function(e) {
			$("#navbar_settings").find("a").click();
		});
		
	}

	OCTOPRINT_VIEWMODELS.push([
		touchUIViewModel,
		["controlViewModel", "connectionViewModel"],
		"#settings_plugin_touch_ui"
	]);
});