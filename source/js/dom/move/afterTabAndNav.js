TouchUI.prototype.DOM.move.afterTabAndNav = function() {

	this.DOM.create.dropdown.container.children().each(function(ind, elm) {
		var $elm = $(elm);
		$('<!-- ko allowBindings: false -->').insertBefore($elm);
		$('<!-- /ko -->').insertAfter($elm);
	});

	//Add hr before the settings icon
	$('<li class="divider"></li>').insertBefore("#navbar_settings");
	$('<li class="divider" id="divider_systemmenu" style="display: none;"></li>').insertBefore("#navbar_systemmenu").attr("data-bind", $("#navbar_systemmenu").attr("data-bind"));

	if ($("#touchui_text_nonlink_container").length > 0) {
		$('<li class="divider"></li>').insertBefore($("#touchui_text_nonlink_container").parent());
	}
}
