TouchUI.prototype.DOM.overwrite.modal = function() {

	//We need a reliable event for catching new modals for attaching a scrolling bar
	$.fn.modalBup = $.fn.modal;
	$.fn.modal = function(options, args) {
		// Update any other modifications made by others (i.e. OctoPrint itself)
		$.fn.modalBup.defaults = $.fn.modal.defaults;

		// Create modal, store into variable so we can trigger an event first before return
		var tmp = $(this).modalBup(options, args);
		if (options !== "hide") {
			$(this).trigger("modal.touchui", this);
		}
		return tmp;
	};
	$.fn.modal.prototype = { constructor: $.fn.modal };
	$.fn.modal.Constructor = $.fn.modal;
	$.fn.modal.defaults = $.fn.modalBup.defaults;

}
