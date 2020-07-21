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

		if($('#control-jog-feedrate .input-append').length === 0) {
			// <1.4.1
			$("#control-jog-feedrate").insertBefore("#control-jog-extrusion");
			$("#control-jog-extrusion button:last-child").prependTo("#control-jog-feedrate");
			$("#control-jog-extrusion input:last-child").attr('data-bind', $("#control-jog-extrusion input:last-child").attr('data-bind').replace('slider: {', 'slider: {tools: tools(), ')).prependTo("#control-jog-feedrate");
			$("#control-jog-extrusion .slider:last-child").prependTo("#control-jog-feedrate");
		} else {
			// >=1.4.1
			$("#control-jog-feedrate").insertBefore("#control-jog-extrusion");
			$("#control-jog-feedrate .input-append button").insertAfter("#control-jog-feedrate .input-append");

			$("#control-jog-flowrate").removeClass("jog-panel");
			$("#control-jog-flowrate .input-append button").insertAfter("#control-jog-flowrate .input-append");
		}

		$("#control div.distance").prependTo("#control-jog-feedrate");
	}

}
