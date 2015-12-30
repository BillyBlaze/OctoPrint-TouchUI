TouchUI.prototype.DOM.overwrite.tabdrop = function() {
	$.fn.tabdrop = function() {};
	$.fn.tabdrop.prototype = { constructor: $.fn.tabdrop };
	$.fn.tabdrop.Constructor = $.fn.tabdrop;
}
