!function ($) {

	$.fn.TouchUI.less = {

		compile: function() {

			less.render('@import "/plugin/touchui/static/css/touchui.generated.less";' + $("#touchui-less-variables").val())
				.then(function(output) {
					console.log(output);
					$("<style></style>").html(output.css).appendTo("head");
				});
		}

	};

}(window.jQuery);
