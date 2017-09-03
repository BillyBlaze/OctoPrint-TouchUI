# coding=utf-8
from __future__ import absolute_import

from .api import touchui_api
from .customization import touchui_customization

import octoprint.plugin
import octoprint.settings
import octoprint.util
import hashlib
import time
import os

class touchui_core(	touchui_api,
					touchui_customization,
					octoprint.plugin.SettingsPlugin,
					octoprint.plugin.AssetPlugin,
					octoprint.plugin.TemplatePlugin,
					octoprint.plugin.StartupPlugin):

	def __init__(self):
		super(touchui_core, self).__init__()
		self._whatsNewPath = os.path.dirname(__file__) + "/WHATSNEW.md"

	def on_settings_load(self):
		return self._load_custom_settings()
		
	def on_settings_save(self, data):
		self._save_custom_settings(data)

	def on_after_startup(self):
		self._check_customization()

	def get_template_vars(self):
		if os.path.isfile(self._customCssPath) and self._settings.get(["useCustomization"]):
			with open(self._customCssPath, 'r') as contentFile:
				return dict(cssPath="./plugin/touchui/static/css/touchui.custom.css", timestamp=hashlib.md5(contentFile.read()).hexdigest()[:9])
		else:
			with open(self._cssPath, 'r') as contentFile:
				return dict(cssPath="./plugin/touchui/static/css/touchui.css", timestamp=hashlib.md5(contentFile.read()).hexdigest()[:9])

	def get_assets(self):
		return dict(
			js=["js/touchui.libraries.js", "js/touchui.bundled.js", "js/touchui.bootstrap.js"]
		)

	def get_template_configs(self):
		files = [
			dict(type="generic", template="touchui_modal.jinja2", custom_bindings=True),
			dict(type="settings", template="touchui_settings.jinja2", custom_bindings=True),
			dict(type="navbar", template="touchui_menu_item.jinja2", custom_bindings=True),
			dict(type="generic", template="touchui_load_css.jinja2", custom_bindings=False)
		]

		if self._settings.get(["automaticallyLoad"]):
			files.append(
				dict(type="generic", template="touchui_auto_load.jinja2", custom_bindings=False)
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
				fontSize="16",
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
				type="github_release",
				user="BillyBlaze",
				repo="OctoPrint-TouchUI",
				current=self._plugin_version,
				pip="https://github.com/BillyBlaze/OctoPrint-TouchUI/archive/{target_version}.zip"
			)
		)

__plugin_name__ = "TouchUI"
def __plugin_load__():
	touchui = touchui_core()

	global __plugin_implementation__
	__plugin_implementation__ = touchui

	global __plugin_hooks__
	__plugin_hooks__ = {
		"octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information,
		"octoprint.server.http.bodysize": __plugin_implementation__.increase_upload_bodysize
	}
