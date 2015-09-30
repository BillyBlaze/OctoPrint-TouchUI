# coding=utf-8
from __future__ import absolute_import

### (Don't forget to remove me)
# This is a basic skeleton for your plugin's __init__.py. You probably want to adjust the class name of your plugin
# as well as the plugin mixins it's subclassing from. This is really just a basic skeleton to get you started,
# defining your plugin as a template plugin.
#
# Take a look at the documentation on what other plugin mixins are available.

import shutil
import os
import logging
import octoprint.plugin
import octoprint.settings
import octoprint.util

dev = True
#dev = False

def dump(obj):
	for attr in dir(obj):
		if hasattr( obj, attr ):
			print( "obj.%s = %s" % (attr, getattr(obj, attr)))

class TouchUIPlugin(octoprint.plugin.SettingsPlugin,
					octoprint.plugin.StartupPlugin,
					octoprint.plugin.AssetPlugin,
					octoprint.plugin.TemplatePlugin):

	def on_startup(self, host, port):
		__tmp = self.get_plugin_data_folder().replace("data/touchui", "generated/webassets/")

		shutil.copytree(self.get_asset_folder() + '/fonts/', __tmp + "fonts/")
		shutil.copy2(self.get_asset_folder() + '/css/libs/fontawesome.css', __tmp + "fonts/")

		self._logger.info("Copied font files to '" + __tmp + "fonts/'")

	def get_assets(self):

		if dev == True:
			less = []
			css = ["css/touchui.css"]
		else:
			less = []
			css = ["css/touchui.css"]

		return dict(
			js=[
				"js/libs/iscroll.js",
				"js/libs/jquery.keyboard.js",

				"js/includes/version.js",
				"js/includes/files.js",
				"js/includes/keyboard.js",
				"js/includes/scroll.js",
				"js/includes/slider.js",
				"js/includes/modal.js",
				"js/includes/DOM.js",
				"js/includes/animate.js",
				"js/includes/terminal.js",
				"js/includes/knockout.js",
				"js/includes/overwrite.js",

				"js/jquery.touchui.js",
				"js/knockout.touchui.js"
			],
			less=less,
			css=css
		)

	def get_template_configs(self):
		return [
			dict(type="usersettings", template="touch_settings.jinja2", custom_bindings=True)
		]

	def get_settings_defaults(self):
		return dict(
			version=self._plugin_version
		)

	def get_version(self):
		return self._plugin_version

	def get_update_information(self):

		return dict(
			touchui=dict(
				displayName="TouchUI Plugin",
				displayVersion=self._plugin_version,

				# version check: github repository
				type="github_release",
				user="BillyBlaze",
				repo="OctoPrint-TouchUI",
				current=self._plugin_version,

				# update method: pip
				pip="https://github.com/BillyBlaze/OctoPrint-TouchUI/archive/{target_version}.zip"
			)
		)

# If you want your plugin to be registered within OctoPrint under a different name than what you defined in setup.py
# ("OctoPrint-PluginSkeleton"), you may define that here. Same goes for the other metadata derived from setup.py that
# can be overwritten via __plugin_xyz__ control properties. See the documentation for that.
__plugin_name__ = "TouchUI Plugin"

def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = TouchUIPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}
