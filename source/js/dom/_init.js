TouchUI.prototype.DOM.init = function() {

	// Create new tab with files, dashboard and temperature and make it active
	this.DOM.create.files.init.call(this, this.DOM.create.tabbar);
	this.DOM.create.dashboard.init(this.DOM.create.tabbar);
	this.DOM.create.temperature.init.call(this);

	// Create a new persistent dropdown
	this.DOM.create.dropdown.init.call( this.DOM.create.dropdown );

	// Move connection sidebar into a new modal
	this.DOM.move.connection.init(this.DOM.create.tabbar);

	// Manipulate controls div
	this.DOM.move.controls.init();

	// Disable these bootstrap/jquery plugins
	this.DOM.overwrite.tabdrop.call(self);
	this.DOM.overwrite.modal.call(self);

	// Add a webcam tab if it's defined
	if ($("#webcam_container").length > 0) {
		this.DOM.create.webcam.init(this.DOM.create.tabbar);
	}

	// Move all other items from tabbar into dropdown
	this.DOM.move.navbar.init.call(this);
	this.DOM.move.overlays.init.call(this);
	this.DOM.move.terminal.init.call(this);

	this.components.material.ripple();
	// $('.dropdown-toggle').each(function(ind, elm) {
	// 	var $elm = $(elm);
	// 	var _id = _.uniqueId("dropdown");
	//
	// 	if(!$elm.parents('#all_touchui_settings').length) {
	//
	// 		$elm.removeClass('dropdown-toggle')
	// 			.attr('data-toggle', null)
	// 			.addClass('dropdown-button')
	// 			.attr('data-activates', _id);
	//
	// 		$elm.next()
	// 			.removeClass('dropdown-menu')
	// 			.addClass('dropdown-content')
	// 			.attr('id', _id);
	//
	// 	}
	// });

	var div = $('<div class="input-field"></div>').appendTo('body');
	var $elems = $('input, textarea, select');
	$elems.each(function moveInputs(ind, elm) {
		var $elm = $(elm);
		var id = $elm.attr("id");
		var $for = (id) ? $('label[for="' + id + '"]') : [];
		//var isControlLabel = $elm.parents('.controls').prev().hasClass('control-label');

		if ($for.length) {

			var $div = div.clone();

			if ($elm.is('select, textarea, input:not([type="radio"]):not([type="checkbox"])')) {
				$div.addClass('withLabel');
			}

			$div.insertAfter($elm);
			$elm.appendTo($div);
			$for.prependTo($div);

		} /*else if ($elm.parent().hasClass("checkbox") || $elm.parent().hasClass("radio") || isControlLabel) {

			var $parent = (isControlLabel) ? $elm.parents('.controls').prev() : $elm.parent();
			var _id = _.uniqueId("input");

			$div = $(div).insertAfter((isControlLabel) ? $elm : $parent);
			$elm.appendTo($div).attr("id", _id);
			$parent.appendTo($div).attr("for", _id);

		}*/

		if ($elm.prop('tagName').toLowerCase() === 'textarea') {
			$elm.addClass('materialize-textarea');
		}

	});

	// $('select').each(function(ind, elm) {
	// 	var $elm = $(elm);
	// 	$elm.attr("data-bind", $elm.attr("data-bind") + ', materialSelect: true');
	// });
	//
	// ko.bindingHandlers.materialSelect = {
	// 	init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
	// 		allBindings();
	// 		$(element).material_select();
	// 	},
	// 	update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
	// 		allBindings();
	// 		$(element).material_select();
	// 	}
	// };

	// Remove active class when clicking on a tab in the tabbar
	$('#tabs [data-toggle=tab]').on("click", function() {
		$("#all_touchui_settings").removeClass("item_active");
	});

}
