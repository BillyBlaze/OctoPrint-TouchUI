TouchUI.prototype.core.less = {

	save: function(viewModel) {
		var variables = "",
			self = this;

		if(viewModel.settings.useCustomization()) {
			if(viewModel.settings.colors.useLocalFile()) {

				$.post("/plugin/touchui/getCSS", {
						path: viewModel.settings.colors.customPath()
					})
					.done(function(response) {
						self.core.less.render.call(self, viewModel, '@import "/plugin/touchui/static/less/touchui.bundled.less";\n' + response);
					})
					.error(function(error) {
						self.core.less.error.call(self, error);
					});

			} else {

				self.core.less.render.call(self, viewModel, '@import "/plugin/touchui/static/less/touchui.bundled.less";\n' +
					'@main-color: '+ viewModel.settings.colors.mainColor() +';' +
					'@terminal-color: '+ viewModel.settings.colors.termColor() +';' +
					'@text-color: '+ viewModel.settings.colors.textColor() +';' +
					'@main-background: '+ viewModel.settings.colors.bgColor() +';'
				);

			}
		}
	},

	render: function(viewModel, data) {
		var self = this,
			callback = function(error, result) {

				if (error) {
					self.core.less.error.call(self, error);
				} else {

					$.post("/plugin/touchui/saveCSS", {
							css: result.css
						})
						.done(function() {
							if(!viewModel.settings.hasCustom()) {
								viewModel.settings.hasCustom(true);
							} else {
								viewModel.settings.hasCustom.valueHasMutated();
							}
						})
						.error(function(error) {
							self.core.less.error.call(self, error);
						});

				}
			};

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
