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
		self._whatsNewPath = os.path.dirname(__file__) + "/WHATSNEW.md"
		self._customLessPath = os.path.dirname(__file__) + "/static/less/_generated/touchui.custom.less"
		self._templateLessPath = os.path.dirname(__file__) + "/static/less/_generated/touchui.template.less"
		self.error = False

	def on_after_startup(self):
		self._toggle_custom_less()

	def on_settings_save(self, data):
		self.error = False
		octoprint.plugin.SettingsPlugin.on_settings_save(self, data)

		try:
			self._toggle_custom_less()
		except Exception as e:
			self._logger.exception("Exception while generating LESS file: {message}".format(message=str(e)))
			self.error = e

	def _toggle_custom_less(self):
		if self._settings.get(["useCustomization"]):
			self._save_custom_less()
		else:
			self._remove_custom_less()

	def _save_custom_less(self):
		if self._settings.get(["colors", "useLocalFile"]) is False:
			with open(self._templateLessPath, "r") as contentFile:
				variableLESS = contentFile.read().format(
					mainColor=self._settings.get(["colors", "mainColor"]),
					termColor=self._settings.get(["colors", "termColor"]),
					textColor=self._settings.get(["colors", "textColor"]),
					bgColor=self._settings.get(["colors", "bgColor"])
				)
		else:
			with open(self._settings.get(["colors", "customPath"]), 'r') as contentFile:
				variableLESS = contentFile.read()

		with open(self._customLessPath, "w+") as customCSS:
			customCSS.write('@import "touchui.bundled.less";\n{less}'.format(less=variableLESS))

	def _remove_custom_less(self):
		if os.path.isfile(self._customLessPath):
			os.unlink(self._customLessPath)

	@octoprint.plugin.BlueprintPlugin.route("/check", methods=["GET"])
	def check(self):
		if os.path.isfile(self._whatsNewPath):
			with open(self._whatsNewPath, 'r') as contentFile:
				whatsNew = contentFile.read()
			os.unlink(self._whatsNewPath)
		else:
			whatsNew = False

		if self.error is False:
			return jsonify(error=False, whatsNew=whatsNew)
		else:
			return jsonify(error=str(self.error), whatsNew=whatsNew)

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

		files = [
			dict(type="generic", template="touchui_modal.jinja2", custom_bindings=True),
			dict(type="settings", template="touchui_settings.jinja2", custom_bindings=True),
			dict(type="navbar", template="touchui_menu_item.jinja2", custom_bindings=True)
		]

		if self._settings.get(["automaticallyLoad"]):
			files.append(
				dict(type="generic", template="touchui_auto_load.jinja2", custom_bindings=False)
			)

		if os.path.isfile(self._customLessPath) and self._settings.get(["useCustomization"]):
			files.append(
				dict(type="generic", template="touchui_load_less.jinja2", custom_bindings=False)
			)
		else:
			files.append(
				dict(type="generic", template="touchui_load_css.jinja2", custom_bindings=False)
			)

		return files

	def get_settings_defaults(self):
		return dict(
			hasVisibleSettings=True,
			automaticallyLoad=True,
			useCustomization=False,
			colors=dict(
				mainColor="#00B0FF",
				termColor="#0F0",
				bgColor="#000",
				textColor="#FFF",
				customPath="",
				useLocalFile=False
			)
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
