TouchUI.prototype.DOM.overwrite.modal = function() {
	$.fn.modal.defaults.backdrop = false;
	$.fn.modal.defaults.manager = $('.octoprint-container > .row > .tabbable > .tab-content');

	$('.modal.fade').removeClass('fade');

	//We need a reliable event for catching new modals for attaching a scrolling bar
	$.fn.modalBup = $.fn.modal;
	$.fn.modal = function(option, args) {
		// Update any other modifications made by others (i.e. OctoPrint itself)
		$.fn.modalBup.defaults = $.fn.modal.defaults;

		$.fn.modal.defaults.manager.find('> .modal-scrollable').not($(this).parent()).addClass('modal-hidden');
		$.fn.modal.defaults.manager.find('> .tab-pane.active').removeClass('active').addClass('pre-active');

		// Create modal, store into variable so we can trigger an event first before return
		var $this = $(this);
		var tmp = $this.modalBup(option, args);

		if (option !== "hide") {
			$this.trigger('modal.touchui', this);

			// setTimeout(function() {
			// 	Materialize.updateTextFields();
			// }, 60);

			tmp.one('destroy', function() {
				if (!$.fn.modal.defaults.manager.find('> .modal-scrollable > .modal').not(this).length) {
					$.fn.modal.defaults.manager.find('> .tab-pane.pre-active').removeClass('pre-active').addClass('active');
				} else {
					var modals = $.fn.modal.defaults.manager.find('.modal-hidden');
					$(modals[modals.length-1]).removeClass('modal-hidden');
				}
			});

			$this
				.trigger('modal-destroy.touchui', this, tmp)
				.parent()
				.removeClass('modal-hidden');
		}

		return tmp;
	};
	$.fn.modal.prototype = { constructor: $.fn.modal };
	$.fn.modal.Constructor = $.fn.modal;
	$.fn.modal.defaults = $.fn.modalBup.defaults;

}
