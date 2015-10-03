# coding=utf-8
from __future__ import absolute_import

import shutil
import os
import logging
import octoprint.plugin
import octoprint.settings
import octoprint.util

class TouchUIPlugin(octoprint.plugin.SettingsPlugin,
					octoprint.plugin.AssetPlugin,
					octoprint.plugin.TemplatePlugin):

	def get_assets(self):

		return dict(
			js=[
				"js/libs/iscroll.js",
				"js/libs/jquery.keyboard.js",
				"js/libs/jquery.fullscreen.js",

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
				"js/includes/fullscreen.js",

				"js/jquery.touchui.js",
				"js/knockout.touchui.js"
			],
			less=[],
			css= ["css/touchui.css"]
		)

	def get_template_configs(self):
		return [
			dict(type="usersettings", template="touch_usersettings.jinja2", custom_bindings=True)
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
				displayName="TouchUI",
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

__plugin_name__ = "TouchUI"
def __plugin_load__():
	global __plugin_implementation__
	__plugin_implementation__ = TouchUIPlugin()

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
	}
