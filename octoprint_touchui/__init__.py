# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin
import octoprint.settings
import octoprint.util
import os

class TouchUIPlugin(octoprint.plugin.SettingsPlugin,
					octoprint.plugin.AssetPlugin,
					octoprint.plugin.TemplatePlugin):

	def __init__(self):
		self.customCSSPath = "/static/less/_generated/touchui.custom.less";
		self.hasVisibleSettings = True
		self.automaticallyLoad = True

		self.activeCustomCSS = os.path.isfile(os.path.dirname(__file__) + self.customCSSPath)
		self.colors_mainColor = "#00B0FF"
		self.colors_termColor = "#0F0"
		self.colors_bgColor = "#000"
		self.colors_textColor = "#FFF"

	def on_settings_save(self, data):
		octoprint.plugin.SettingsPlugin.on_settings_save(self, data)
		self.save_custom_less()

	def on_after_startup(self):
		self.hasVisibleSettings = self._settings.get(["hasVisibleSettings"])
		self.automaticallyLoad = self._settings.get(["automaticallyLoad"])

		self.colors_mainColor = self._settings.get(["colors", "mainColor"])
		self.colors_termColor = self._settings.get(["colors", "termColor"])
		self.colors_bgColor = self._settings.get(["colors", "bgColor"])
		self.colors_textColor = self._settings.get(["colors", "textColor"])

		self.save_custom_less()

	def get_assets(self):
		self.activeCustomCSS = os.path.isfile(os.path.dirname(__file__) + self.customCSSPath)
		css = []
		less = []

		if self.activeCustomCSS is False:
			css.append("css/touchui.css")

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
				"js/includes/plugins.js",

				"js/jquery.touchui.js",
				"js/knockout.touchui.js"
			],
			css=css,
			less=less
		)

	def get_template_configs(self):
		self.activeCustomCSS = os.path.isfile(os.path.dirname(__file__) + self.customCSSPath)

		files = [
			dict(type="generic", template="touchui_modal.jinja2", custom_bindings=True),
			dict(type="settings", template="touchui_settings.jinja2", custom_bindings=True),
			dict(type="navbar", template="touchui_menu_item.jinja2", custom_bindings=True)
		]

		if self._settings.get(["automaticallyLoad"]) is True:
			files.append(
				dict(type="generic", template="touchui_load.jinja2", custom_bindings=True)
			)

		if self.activeCustomCSS is not False:
			files.append(
				dict(type="generic", template="touchui_load_less.jinja2", custom_bindings=True)
			)

		return files

	def get_settings_defaults(self):
		return dict(
			hasVisibleSettings=self.hasVisibleSettings,
			automaticallyLoad=self.automaticallyLoad,
			activeCustomCSS=os.path.isfile(os.path.dirname(__file__) + self.customCSSPath),
			colors=dict(
				mainColor=self.colors_mainColor,
				termColor=self.colors_termColor,
				bgColor=self.colors_bgColor,
				textColor=self.colors_textColor
			)
		)

	def save_custom_less(self):
		customCSS = open(os.path.dirname(__file__) + self.customCSSPath, 'w+')
		customCSS.write('@import "touchui.generated.less";' + "\n" +
			'@main-color:' + self._settings.get(["colors", "mainColor"]) + ';' +
			'@terminal-color:' + self._settings.get(["colors", "termColor"]) + ';' +
			'@text-color:' + self._settings.get(["colors", "textColor"]) + ';' +
			'@main-background:' + self._settings.get(["colors", "bgColor"]) + ';')
		customCSS.close()
		self.activeCustomCSS = True

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
