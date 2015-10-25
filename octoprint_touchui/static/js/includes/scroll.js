!function ($) {

	$.fn.TouchUI.scroll = {

		defaults: {
			iScroll: {
				scrollbars: true,
				mouseWheel: true,
				interactiveScrollbars: true,
				shrinkScrollbars: "scale",
				fadeScrollbars: true,
				disablePointer: true
			}
		},

		iScrolls: {},
		currentActive: null,

		beforeLoad: function() {

			// Manipulate DOM for iScroll before knockout binding kicks in
			if (!this.isTouch) {
				$('<div id="scroll"></div>').insertBefore('.page-container');
				$('.page-container').appendTo("#scroll");
			}

			// Create iScroll container for terminal anyway, we got styling on that
			var cont = $('<div id="terminal-scroll"></div>').insertBefore("#terminal-output");
			$("#terminal-output").appendTo(cont);

		},

		// Add scrolling with mousedown if there is no touch
		init: function() {
			var self = this;

			if (this.isTouch) {
				var innerHeight = $(window).innerHeight() - 40;

				// Covert VH to ViewPort
				$("#temperature-graph").height(innerHeight);
				$("#terminal-scroll").height(innerHeight - 70);
				$("#terminal-sendpanel").css("top", innerHeight - 70)

				$(window).on("orientationchange", function() {
					setTimeout(function() {
						innerHeight = $(window).innerHeight() - 40;
						$("#temperature-graph").height(innerHeight);
						$("#terminal-scroll").height(innerHeight - 70);
						$("#terminal-sendpanel").css("top", innerHeight - 70)
					}, 600);
				});

			} else {

				// Set overflow hidden for best performance
				$("html").addClass("hasScrollTouch");

				self.scroll.terminal.init.call(self);
				self.scroll.body.init.call(self);
				self.scroll.modal.init.call(self);

				// Try to bind inputs, textareas and buttons to keyup rather then mousedown
				// Not on selects since we can't cancel the preventDefault
				$('input, textarea, button').on("mousedown", function(e) {
					e.preventDefault();
					$(e.target).addClass("no-pointer");
				});
				// $(document).on("mousedown", 'input, textarea, button', function(e) {
				//
				// 	var scrolled = false,
				// 		toggle = function(event) {
				// 			scrolled = true;
				// 		};
				//
				// 	self.scroll.currentActive.on("scrollStart", toggle);
				//
				// 	$(document).on("mouseup", function(event) {
				//
				// 		if(!scrolled && $(event.target).parents($(e.delegateTarget)).length > 0) {
				// 			$(e.delegateTarget).focus()/*.addClass('touch-focus').animate({opacity:1}, 300, function() {
				// 				$(e.delegateTarget).removeClass('touch-focus');
				// 			})*/;
				// 		}
				//
				// 		self.scroll.currentActive.off("scrollStart", toggle);
				// 		$(document).off(event);
				// 	});
				//
				// 	return false;
				//
				// });

				// Prevent no-pointer from disabling navigation
				// $('[data-toggle="dropdown"]').on("click", function(e) {
				// 	$(e.target).closest(".no-pointer").removeClass("no-pointer");
				// });

			}

		},

		koOverwrite: function(terminalViewModel) {
			var self = this;

			if ( !this.isTouch ) {

				// Refresh terminal scroll height
				terminalViewModel.displayedLines.subscribe(function() {
					self.scroll.iScrolls.terminal.refresh();
				});

				// Overwrite scrollToEnd function with iScroll functions
				terminalViewModel.scrollToEnd = function() {
					self.scroll.iScrolls.terminal.refresh();
					self.scroll.iScrolls.terminal.scrollTo(0, self.scroll.iScrolls.terminal.maxScrollY);
				};

				// Overwrite orginal helper, add one step and call the orginal function
				var showOfflineOverlay = window.showOfflineOverlay;
				window.showOfflineOverlay = function(title, message, reconnectCallback) {
					self.scroll.iScrolls.body.scrollTo(0, 0, 500);
					showOfflineOverlay.call(this, title, message, reconnectCallback);
				};

				// Overwrite orginal helper, add one step and call the orginal function
				var showConfirmationDialog = window.showConfirmationDialog;
				window.showConfirmationDialog = function(message, onacknowledge) {
					self.scroll.iScrolls.body.scrollTo(0, 0, 500);
					showConfirmationDialog.call(this, message, onacknowledge);
				};

				// Well this is easier, isn't it :D
				$("#reloadui_overlay").on("show", function() {
					self.scroll.iScrolls.body.scrollTo(0, 0, 500);
				});

			} else {

				// Overwrite scrollToEnd function with #terminal-scroll as scroller
				terminalViewModel.scrollToEnd = function() {
					var $container = $("#terminal-scroll");
					if ($container.length) {
						$container.scrollTop($container[0].scrollHeight - $container.height())
					}
				}

			}
		},

		body: {

			init: function() {
				var self = this,
					scrollStart = false;

				// Create main body scroll
				self.scroll.iScrolls.body = new IScroll("#scroll", self.scroll.defaults.iScroll);
				self.scroll.currentActive = self.scroll.iScrolls.body;

				// Create a hidden div and initiialze to get prototype instance
				var dropdown = $('<div></div>').dropdown().data("dropdown");

				// Improve scrolling while dropdown is open
				$(document).off('.dropdown.data-api');
				$(document)
					.on('click.dropdown touchstart.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
					.on('touchstart.dropdown.data-api', '.dropdown-menu', function (e) { e.stopPropagation() })
					.on('click.dropdown.data-api touchstart.dropdown.data-api', '[data-toggle=dropdown]', function(e) {
						var dropdownToggle = this,
							$dropdown = $('.page-container');

						// Stop default
						e.preventDefault()

						// Toggle dropdown through memory prototype
						if( !$(dropdownToggle).parent().hasClass('open') ) {
							$(dropdownToggle).parent().addClass('open');
						} else {
							$(dropdownToggle).parent().removeClass('open');
							return; //Do not create events
						}

						// Store bindings into variable for future reference
						var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $dropdown, self.scroll.currentActivey),
							scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $dropdown, self.scroll.currentActive);

						// Block everthing while scrolling
						self.scroll.iScrolls.body.on("scrollStart", scrollStart);
						self.scroll.iScrolls.body.on("scrollEnd", scrollEnd);
						self.scroll.iScrolls.body.on("scrollCancel", scrollEnd);

						// Reset it all, turn events back on
						$(document).on("mouseup.dropdown-toggle.touchui touchend.dropdown-toggle.touchui", function(event) {
							var $elm = $(event.target);

							if( $dropdown.hasClass("no-pointer") || $elm.hasClass("dropdown-menu") || ($elm.parents(".dropdown-menu").length > 0 && $elm.prop("tagName") !== "A") ) {
								return;
							} else {
								$(document).off(".dropdown-toggle.touchui");

								self.scroll.iScrolls.body.off("scrollStart", scrollStart);
								self.scroll.iScrolls.body.off("scrollEnd", scrollEnd);
								self.scroll.iScrolls.body.off("scrollCancel", scrollEnd);

								// If clicked element is same as dropdown toggle, close it
								if( !$elm.parent().is($(dropdownToggle).parent()) ) {
									$(dropdownToggle).parent().removeClass('open');
								}

							}
						});

					});

			}
		},

		terminal: {

			init: function() {
				var self = this;

				// Create scrolling for terminal
				self.scroll.iScrolls.terminal = new IScroll("#terminal-scroll", self.scroll.defaults.iScroll);

				// Enforce the right scrollheight and disable main scrolling if we have a scrolling content
				self.scroll.iScrolls.terminal.on("beforeScrollStart", function() {
					self.scroll.iScrolls.terminal.refresh();

					if(this.hasVerticalScroll) {
						self.scroll.iScrolls.body.disable();
					}
				});
				self.scroll.iScrolls.terminal.on("scrollEnd", function() {
					self.scroll.iScrolls.body.enable();
				});

			}
		},

		modal: {
			stack: [],
			dropdown: null,

			init: function() {
				var $document = $(document),
					self = this;

				$document.on("modal.touchui", function(e, elm) {
					var $modalElm = $(elm),
						$modalContainer = $(elm).parent();

					// Create temp iScroll within the modal
					var curModal = new IScroll($modalContainer[0], self.scroll.defaults.iScroll);

					// Store into stack
					self.scroll.modal.stack.push(curModal);

					try {
						// Force iScroll to get the correct scrollHeight
						setTimeout(function() {
							curModal.refresh();
						}, 0);
						// And Refresh again after animation
						setTimeout(function() {
							curModal.refresh();
						}, 800);
					} catch(err) { }

					// Store bindings into variable for future reference
					var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $modalElm, curModal),
						scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $modalElm, curModal);

					// Disable all JS events while scrolling for best performance
					curModal.on("scrollStart", scrollStart);
					curModal.on("scrollEnd", scrollEnd);
					curModal.on("scrollCancel", scrollEnd);

					// Refresh the scrollHeight and scroll back to top with these actions:
					$document.on("click.touchui", '[data-toggle="tab"], .pagination ul li a', function(e) {
						curModal.stop();

						setTimeout(function() {
							curModal.refresh();
							curModal.scrollTo(0, 0);
						}, 0);
					});

					// Kill it with fire!
					$modalElm.one("destroy", function() {
						$document.off("click.touchui");
						curModal.destroy();
						self.scroll.modal.stack.pop();

						if(self.scroll.modal.stack.length > 0) {
							self.scroll.currentActive = self.scroll.modal.stack[self.scroll.modal.stack.length-1];
						} else {
							self.scroll.currentActive = self.scroll.iScrolls.body;
						}

						curModal.off("scrollStart", scrollStart);
						curModal.off("scrollEnd", scrollEnd);
						curModal.off("scrollCancel", scrollEnd);
					});

				});

				// Triggered when we create the dropdown and need scrolling
				$document.on("dropdown-open.touchui", function(e, elm) {
					var $elm = $(elm);

					// Create dropdown scroll
					self.scroll.modal.dropdown = new IScroll(elm, {
						scrollbars: true,
						mouseWheel: true,
						interactiveScrollbars: true,
						shrinkScrollbars: "scale"
					});

					// Set scroll to active item
					self.scroll.modal.dropdown.scrollToElement($elm.find('li.active')[0], 0, 0, -30);

					// Disable scrolling in active modal
					self.scroll.modal.stack[self.scroll.modal.stack.length-1].disable();

					// Store bindings into variable for future reference
					var scrollStart = self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $elm, self.scroll.modal.dropdown),
						scrollEnd = self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.modal.dropdown);

					// Disable all JS events for smooth scrolling
					self.scroll.modal.dropdown.on("scrollStart", scrollStart);
					self.scroll.modal.dropdown.on("scrollEnd", scrollEnd);
					self.scroll.modal.dropdown.on("scrollCancel", scrollEnd);

					$document.on("dropdown-closed.touchui", function() {
						// Enable active modal
						self.scroll.modal.stack[self.scroll.modal.stack.length-1].enable();

						self.scroll.modal.dropdown.off("scrollStart", scrollStart);
						self.scroll.modal.dropdown.off("scrollEnd", scrollEnd);
						self.scroll.modal.dropdown.off("scrollCancel", scrollEnd);
					});

				});

			}
		},

		// Some diehard method of blocking any mousepointer event while scrolling with iScroll
		blockEvents: {
			className: "no-pointer",

			scrollStart: function($elm, iScrollInstance) {
				$elm.addClass(this.className);
			},

			scrollEnd: function($elm, iScrollInstance) {
				var self = this;
				$elm.removeClass(self.className);
				iScrollInstance.refresh();
			}

		}
	};

}(window.jQuery);
