TouchUI.prototype.plugins.disable = {
	plugins: [
		{
			htmlId: '#settings_plugin_themeify',
			name: 'Themeify'
		}, {
			functionName: 'TempsgraphViewModel',
			name: 'TempsGraph'
		}, {
			functionName: 'WebcamTabViewModel',
			name: 'WebcamTab',
			extra: function() {
				$('#tab_plugin_webcamtab_link').remove();
			}
		}, {
			functionName: 'AblExpertViewModel',
			name: 'ABLExpert',
			extra: function() {
				$('#settings_plugin_ABL_Expert').hide();
				$('#settings_plugin_ABL_Expert_link').hide();
				$('#processing_dialog_plugin_ABL_Expert').hide();
				$('#results_dialog_plugin_ABL_Expert').hide();
			}
		}
	],

	init: function () {
		var self = this;

		_.remove(OCTOPRINT_VIEWMODELS, function(viewModel) {
			return _.some(
				self.plugins.disable.plugins,
				self.plugins.disable.find.bind(
					_.flattenDeep(
						_.isPlainObject(viewModel) ? _.values(viewModel) : viewModel
					)
				)
			);
		});
	},

	find: function(plugin) {
		var result = false;

		if (plugin.htmlId) {
			result = this.indexOf(plugin.htmlId) !== -1;
		}

		if (plugin.functionName) {
			result = _.some(this, function(viewModelProp) {
				return viewModelProp.name && viewModelProp.name === plugin.functionName;
			});
		}

		if (result) {
			console.info("TouchUI: " + plugin.name + " is disabled while TouchUI is active.");

			if (plugin.extra) {
				plugin.extra();
			}
		}

		return result;
	}
}
