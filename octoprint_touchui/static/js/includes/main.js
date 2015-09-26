!function ($) {

	$.fn.TouchUI = {};
	$.fn.TouchUI.main = {
		id: "touch",

		init: function() {

			if( this.isActive ) {
				$("html").attr("id", this.main.id);
				this.DOM.cookies.set("active", "true");

				//Disable tabdrop, menu should be responsive enough :)
				$.fn.tabdrop = function() {};
				$.fn.tabdrop.prototype = { constructor: $.fn.tabdrop };
				$.fn.tabdrop.Constructor = $.fn.tabdrop;

				if( !this.isTouch ) {
					//We need a reliable event for catching new modals for attaching a scrolling bar
					$.fn.modalBup = $.fn.modal;
					$.fn.modal = function(option, args) {
						// Update any other modifications made by others (i.e. OctoPrint itself)
						$.fn.modalBup.defaults = $.fn.modal.defaults;

						// Create modal, store into variable so we can trigger an event first before return
						var tmp = $(this).modalBup(option, args);
						$(this).trigger("modal.touchui", this);
						return tmp;
					};
					$.fn.modal.prototype = { constructor: $.fn.modal };
					$.fn.modal.Constructor = $.fn.modal;
					$.fn.modal.defaults = $.fn.modalBup.defaults;
				}

			}

		},

		version: {

			init: function(settingsViewModel, softwareUpdateViewModel) {
				var self = this;

				//Get currect version from settingsView and store them
				this.version = settingsViewModel.settings.plugins.touchui.version();

				// Update the content of the version
				$('head').append('<style id="touch_updates_css">#term pre:after{ content: "v'+this.version+'" !important; }</style>');

				softwareUpdateViewModel.versions.items.subscribe(function(changes) {

					var touchui = softwareUpdateViewModel.versions.getItem(function(elm) {
						return (elm.key === "touchui");
					}, true) || false;

					if( touchui !== false && (touchui.information.remote.value !== self.version && touchui.information.remote.value !== null) ) {
						$("#touch_updates_css").remove();
						$('head').append('<style id="touch_updates_css">#term pre:after{ content: "v'+self.version+" outdated, new version: v"+touchui.information.remote.value+'" !important; }</style>');
					}

				});

			}

		}

	};

}(window.jQuery);
