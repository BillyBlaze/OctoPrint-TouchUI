TouchUI.prototype.DOM.move.controls = {

	init: function() {

		// backward compatibility with <1.3.0
		if($('#control-jog-feedrate').length === 0) {
			var jogPanels = $('#control > .jog-panel');

			$(jogPanels[0]).find(".jog-panel:nth-child(1)").attr("id", "control-jog-xy");
			$(jogPanels[0]).find(".jog-panel:nth-child(2)").attr("id", "control-jog-z");
			$(jogPanels[1]).attr("id", "control-jog-extrusion");
			$(jogPanels[2]).attr("id", "control-jog-general");

			$('<div class="jog-panel" id="control-jog-feedrate"></div>').insertAfter($(jogPanels[2]));
			$(jogPanels[0]).find("> button:last-child").prependTo("#control-jog-feedrate");
			$(jogPanels[0]).find("> input:last-child").prependTo("#control-jog-feedrate");
			$(jogPanels[0]).find("> .slider:last-child").prependTo("#control-jog-feedrate");

		}

		$("#control-jog-feedrate").attr("data-bind", $("#control-jog-extrusion").data("bind")).insertAfter("#control-jog-extrusion");
		$("#control-jog-extrusion button:last-child").prependTo("#control-jog-feedrate");
		$("#control-jog-extrusion input:last-child").prependTo("#control-jog-feedrate");
		$("#control-jog-extrusion .slider:last-child").prependTo("#control-jog-feedrate");

		$("#control div.distance").prependTo("#control-jog-feedrate");
		$("#control-jog-feedrate").insertBefore("#control-jog-extrusion");
		$("#control-jog-general").appendTo($('#control > .jog-panel')[0]);

		var t = $('<div class="accordion-inner touch-area"></div>').prependTo("#control");
		$("#control").children().appendTo(t);
		$('<div class="accordion-heading"><a href="#controls">Controls</a></div>').prependTo("#control");

	}

}
