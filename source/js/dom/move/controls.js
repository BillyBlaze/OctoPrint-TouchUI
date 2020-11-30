TouchUI.prototype.DOM.move.controls = {

	init: function() {

		if($('#control-jog-feedrate .input-append').length === 0) {
			// <1.4.1
			$("#control-jog-feedrate").insertBefore("#control-jog-extrusion");
			$("#control-jog-extrusion button:last-child").prependTo("#control-jog-feedrate");
			$("#control-jog-extrusion input:last-child").attr('data-bind', $("#control-jog-extrusion input:last-child").attr('data-bind').replace('slider: {', 'slider: {tools: tools(), ')).prependTo("#control-jog-feedrate");
			$("#control-jog-extrusion .slider:last-child").prependTo("#control-jog-feedrate");
		}

		// Move Z-panel
		$("#control-jog-general").insertAfter("#control-jog-z");

		// Create panel
		var $jog = $('<div/>').attr('id', 'control-jog-rate').insertBefore('#control-jog-extrusion');
		$("#control div.distance").appendTo($jog);
		$("#control-jog-feedrate").appendTo($jog);
		$("#control-jog-flowrate").appendTo($jog);
	}

}
