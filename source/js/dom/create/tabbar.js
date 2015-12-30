TouchUI.prototype.DOM.create.tabbar = {

	createItem: function(itemId, linkId, toggle, text) {
		text = (text) ? text : "";
		return $('<li id="'+itemId+'"><a href="#'+linkId+'" data-toggle="'+toggle+'">'+text+'</a></li>');

	}
}
