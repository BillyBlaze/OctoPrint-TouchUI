# coding=utf-8
from __future__ import absolute_import

import octoprint.plugin
import octoprint.settings
import octoprint.util
import os

from flask import jsonify
import flask

class TouchUIPlugin(octoprint.plugin.SettingsPlugin,
					octoprint.plugin.AssetPlugin,
 					octoprint.plugin.BlueprintPlugin,
					octoprint.plugin.TemplatePlugin,
					octoprint.plugin.StartupPlugin):

	def __init__(self):
		self.customCSSPath = "/static/less/_generated/touchui.custom.less";
		self.hasVisibleSettings = True
		self.automaticallyLoad = True
		self.useCustomization = False

		self.colors_customPath = ""
		self.colors_useLocalFile = False

		self.activeCustomFile = os.path.isfile(os.path.dirname(__file__) + self.customCSSPath)
		self.colors_mainColor = "#00B0FF"
		self.colors_termColor = "#0F0"
		self.colors_bgColor = "#000"
		self.colors_textColor = "#FFF"

		self.errorPlaceholder = False

	def on_after_startup(self):
		self.hasVisibleSettings = self._settings.get(["hasVisibleSettings"])
		self.automaticallyLoad = self._settings.get(["automaticallyLoad"])
		self.useCustomization = self._settings.get(["useCustomization"])

		self.colors_customPath = self._settings.get(["colors", "customPath"])
		self.colors_useLocalFile = self._settings.get(["colors", "useLocalFile"])

		self.colors_mainColor = self._settings.get(["colors", "mainColor"])
		self.colors_termColor = self._settings.get(["colors", "termColor"])
		self.colors_bgColor = self._settings.get(["colors", "bgColor"])
		self.colors_textColor = self._settings.get(["colors", "textColor"])

		self.toggle_custom_less()

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
				"js/includes/plugins.js",

				"js/jquery.touchui.js",
				"js/knockout.touchui.js"
			]
		)

	def get_template_configs(self):
		self.activeCustomFile = os.path.isfile(os.path.dirname(__file__) + self.customCSSPath)

		files = [
			dict(type="generic", template="touchui_modal.jinja2", custom_bindings=True),
			dict(type="settings", template="touchui_settings.jinja2", custom_bindings=True),
			dict(type="navbar", template="touchui_menu_item.jinja2", custom_bindings=True)
		]

		if self._settings.get(["automaticallyLoad"]) is True:
			files.append(
				dict(type="generic", template="touchui_auto_load.jinja2", custom_bindings=True)
			)

		if self.activeCustomFile is True and self._settings.get(["useCustomization"]) is True:
			files.append(
				dict(type="generic", template="touchui_load_less.jinja2", custom_bindings=True)
			)
		else:
			files.append(
				dict(type="generic", template="touchui_load_css.jinja2", custom_bindings=True)
			)

		return files

	def get_settings_defaults(self):
		return dict(
			hasVisibleSettings=self.hasVisibleSettings,
			automaticallyLoad=self.automaticallyLoad,
			useCustomization=self.useCustomization,
			colors=dict(
				mainColor=self.colors_mainColor,
				termColor=self.colors_termColor,
				bgColor=self.colors_bgColor,
				textColor=self.colors_textColor,
				customPath=self.colors_customPath,
				useLocalFile=self.colors_useLocalFile
			)
		)

	def on_settings_save(self, data):
		try:
			self.errorPlaceholder = False
			octoprint.plugin.SettingsPlugin.on_settings_save(self, data)
			self.toggle_custom_less()
		except Exception, e:
			self._logger.error(e)
			self.errorPlaceholder = e

	def toggle_custom_less(self):
		if self._settings.get(["useCustomization"]) is True:
			self.save_custom_less()
		else:
			self.remove_custom_less()

	def save_custom_less(self):
		if self._settings.get(["colors", "useLocalFile"]) is False:
			variableLESS =  "@main-color:" + self._settings.get(["colors", "mainColor"]) + ";\n@terminal-color:" + self._settings.get(["colors", "termColor"]) + ";\n@text-color:" + self._settings.get(["colors", "textColor"]) + ";\n@main-background:" + self._settings.get(["colors", "bgColor"]) + ";"
		else:
			with open(self._settings.get(["colors", "customPath"]), 'r') as content_file:
				variableLESS = content_file.read()

		customCSS = open(os.path.dirname(__file__) + self.customCSSPath, 'w+')
		customCSS.write('@import "touchui.bundled.less"' + ";\n" + variableLESS)
		customCSS.close()
		self.activeCustomFile = os.path.isfile(os.path.dirname(__file__) + self.customCSSPath)

	def remove_custom_less(self):
		if os.path.isfile(os.path.dirname(__file__) + self.customCSSPath):
			os.unlink(os.path.dirname(__file__) + self.customCSSPath)

	@octoprint.plugin.BlueprintPlugin.route("/check", methods=["GET"])
	def checkSave(self):
		if self.errorPlaceholder is False:
			return jsonify(error="false")
		else:
			return jsonify(error=self.errorPlaceholder.strerror)

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
