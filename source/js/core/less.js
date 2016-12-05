TouchUI.prototype.core.less = {

	options: {
		template: {
			importUrl:	"./plugin/touchui/static/less/touchui.bundled.less?t=" + new Date().getTime(),
			import:		'@import "{importUrl}"; \n',
			variables:	"@main-color: {mainColor}; \n" +
						"@terminal-color: {termColor}; \n" +
						"@text-color: {textColor}; \n" +
						"@main-background: {bgColor}; \n\n"
		},
		API: "./plugin/touchui/css"
	},

	save: function() {
		var variables = "";
		var options = this.core.less.options;
		var self = this;

		if(self.settings.useCustomization()) {
			if(self.settings.colors.useLocalFile()) {

				$.get(options.API, {
						path: self.settings.colors.customPath()
					})
					.done(function(response) {
						self.core.less.render.call(self, options.template.import.replace("{importUrl}", options.template.importUrl) + response);
					})
					.error(function(error) {
						self.core.less.error.call(self, error);
					});

			} else {

				self.core.less.render.call(self, "" +
					options.template.import.replace("{importUrl}", options.template.importUrl) +
					options.template.variables.replace("{mainColor}", self.settings.colors.mainColor())
						.replace("{termColor}", self.settings.colors.termColor())
						.replace("{textColor}", self.settings.colors.textColor())
						.replace("{bgColor}", self.settings.colors.bgColor())
				);

			}
		}
	},

	render: function(data) {
		var self = this;
		var callback = function(error, result) {

				if (error) {
					self.core.less.error.call(self, error);
				} else {

					$.post(self.core.less.options.API, {
							css: result.css
						})
						.done(function() {
							if (self.settings.requireNewCSS()) {
								self.settings.refreshCSS("fast");
							}
						})
						.error(function(error) {
							self.core.less.error.call(self, error);
						});

				}
			}

		if(window.less.render) {
			window.less.render(data, {
				compress: true
			}, callback);
		} else {
			window.less.Parser({}).parse(data, function(error, result) {
				if(result) {
					result = {
						css: result.toCSS({
							compress: true
						})
					}
				}
				callback.call(this, error, result);
			});
		}
	},

	error: function(error) {
		var content = error.responseText;
		if(content && content.trim() && error.status !== 401) {
			new PNotify({
				title: 'TouchUI: Whoops, something went wrong...',
				text: content,
				icon: 'glyphicon glyphicon-question-sign',
				type: 'error',
				hide: false
			});
		}

	}

}
