TouchUI.prototype.components.dropdown = function() {
	$(".dropdown-submenu a").on("click", function(e) {
		e.preventDefault();
		e.stopPropagation();

		$(e.target).parent().toggleClass("dropdown open");
	});
}
