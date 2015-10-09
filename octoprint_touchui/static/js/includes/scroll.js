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

					var scrolled = false;
					self.scroll.iScrolls.body.on("scrollStart", function(event) {
						scrolled = true;
					});

					$(document).on("mouseup", function(event) {

						if(!scrolled && $(event.target).parents($(e.delegateTarget)).length > 0) {
							$(e.delegateTarget).focus().addClass('touch-focus').animate({opacity:1}, 300, function() {
								$(e.delegateTarget).removeClass('touch-focus');
							});
						}

						self.scroll.iScrolls.body.off("scrollStart");
						$(document).off(event);
					});

				});

				// Prevent no-pointer from disabling navigation
				$('[data-toggle="dropdown"]').on("click", function(e) {
					$(e.target).closest(".no-pointer").removeClass("no-pointer");
				});

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
				var self = this;

				// Create main body scroll
				self.scroll.iScrolls.body = new IScroll("#scroll", self.scroll.defaults.iScroll);

				// Prevent dropdowns from closing when scrolling with them
				$(document).on("mousedown", ".dropdown-menu", function(e) {
					var $elm = $(e.currentTarget);

					// Add CSS pointer-events: none; to block all JS events
					self.scroll.iScrolls.body.on("scrollStart", self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $elm, self.scroll.iScrolls.body));
					self.scroll.iScrolls.body.on("scrollEnd", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.iScrolls.body));
					self.scroll.iScrolls.body.on("scrollCancel", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.iScrolls.body));

					$(document).one("mouseup", function() {
						self.scroll.iScrolls.body.off("scrollStart", self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $elm, self.scroll.iScrolls.body));
						self.scroll.iScrolls.body.off("scrollEnd", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.iScrolls.body));
						self.scroll.iScrolls.body.off("scrollCancel", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.iScrolls.body));
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

					// Disable all JS events while scrolling for best performance
					curModal.on("scrollStart", self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $modalElm, curModal));
					curModal.on("scrollEnd", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $modalElm, curModal));
					curModal.on("scrollCancel", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $modalElm, curModal));

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

					// Disable all JS events for smooth scrolling
					self.scroll.modal.dropdown.on("scrollStart", self.scroll.blockEvents.scrollStart.bind(self.scroll.blockEvents, $elm, self.scroll.modal.dropdown));
					self.scroll.modal.dropdown.on("scrollEnd", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.modal.dropdown));
					self.scroll.modal.dropdown.on("scrollCancel", self.scroll.blockEvents.scrollEnd.bind(self.scroll.blockEvents, $elm, self.scroll.modal.dropdown));
				});

				$document.on("dropdown-closed.touchui", function() {
					// Enable active modal
					self.scroll.modal.stack[self.scroll.modal.stack.length-1].enable();
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
