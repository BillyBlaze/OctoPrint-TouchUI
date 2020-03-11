# coding=utf-8
from __future__ import absolute_import

try:
	from octoprint.access.permissions import Permissions
except:
	from octoprint.server import admin_permission

import octoprint.plugin
import octoprint.settings
import octoprint.util
import hashlib
import time
import os

class touchui_customization(object):
	def _startup_customization(self, host, port):
		self._port = port
		self._cssPath = "{base}/static/css/touchui.css".format(base=os.path.dirname(__file__))
		self._customCssPath = "{base}/static/css/touchui.custom.{port}.css".format(base=os.path.dirname(__file__), port=port)
		self._customLessPath = "{base}/static/less/touchui.bundled.less".format(base=os.path.dirname(__file__))
		self._customHashPath = "{base}/static/css/hash.{port}.touchui".format(base=os.path.dirname(__file__), port=port)
		self._requireNewCSS = False
		self._refreshCSS = False
		self._refreshTime = 0

		# Migrate old css file to path with port
		if os.path.isfile("{base}/static/css/touchui.custom.css".format(base=os.path.dirname(__file__))):
			os.rename(
				"{base}/static/css/touchui.custom.css".format(base=os.path.dirname(__file__)),
				"{base}/static/css/touchui.custom.{port}.css".format(base=os.path.dirname(__file__), port=port)
			)

		# Migrate old hash file to path with port
		if os.path.isfile("{base}/static/css/hash.touchui".format(base=os.path.dirname(__file__))):
			os.rename(
				"{base}/static/css/hash.touchui".format(base=os.path.dirname(__file__)),
				"{base}/static/css/hash.{port}.touchui".format(base=os.path.dirname(__file__), port=port)
			)

	def _check_customization(self):
		# When generating LESS to CSS we also store the LESS contents into a md5 hash
		# if the hash of the local LESS file doesn't match this saved hash, then that indicates
		# that the LESS file has been update and that it requires a new compile.
		#
		# Therefor we going to put _requireNewCSS on TRUE, and we then let an admin compile the
		# LESS to CSS and store it in local CSS file.
		if self._settings.get(["useCustomization"]):
			hashedNew = "1"
			hashedOld = "2"

			if os.path.isfile(self._customLessPath):
				with open(self._customLessPath, 'r') as contentFile:
					hashedNew = hashlib.md5(contentFile.read().encode('utf-8')).hexdigest()

			if os.path.isfile(self._customHashPath):
				with open(self._customHashPath, 'r') as contentFile:
					hashedOld = contentFile.read()

			if hashedNew != hashedOld:
				self._requireNewCSS = True

		else:
			self._remove_custom_css()

	def _load_custom_settings(self):
		data = dict(octoprint.plugin.SettingsPlugin.on_settings_load(self))
		data["hasCustom"] = os.path.isfile(self._customCssPath)
		data["requireNewCSS"] = self._requireNewCSS
		data["refreshCSS"] = self._refreshCSS
		data["whatsNew"] = False

		try:
			plugin_permission = Permissions.SETTINGS.can()
		except:
			plugin_permission = admin_permission.can()

		if plugin_permission:
			if os.path.isfile(self._whatsNewPath):
				with open(self._whatsNewPath, 'r') as contentFile:
					data["whatsNew"] = contentFile.read()
				os.unlink(self._whatsNewPath)

			if self._requireNewCSS is True:
				self._requireNewCSS = False

			if self._settings.get(["useCustomization"]):
				if os.path.isfile(self._customHashPath) is not True:
					data["requireNewCSS"] = True

			if self._refreshCSS:
				if self._refreshTime < time.time():
					data["refreshCSS"] = False
					self._refreshCSS = False
					self._refreshTime = 0

		return data

	def _save_custom_settings(self, data):
		octoprint.plugin.SettingsPlugin.on_settings_save(self, data)

		if self._settings.get(["useCustomization"]) is False:
			self._remove_custom_css()
		else:
			self._refreshCSS = True
			self._refreshTime = time.time() + 10

	def _save_custom_css(self, data):
		self._requireNewCSS = False
		hashed = ""

		with open(self._customCssPath, "w+") as customCSS:
			customCSS.write('{css}'.format(css=data))

		if os.path.isfile(self._customLessPath):
			with open(self._customLessPath, 'r') as contentFile:
				hashed = hashlib.md5(contentFile.read().encode('utf-8')).hexdigest()

		with open(self._customHashPath, "w+") as customHash:
			customHash.write('{hash}'.format(hash=hashed))

	def _remove_custom_css(self):
		self._requireNewCSS = False

		if os.path.isfile(self._customCssPath):
			os.unlink(self._customCssPath)

		if os.path.isfile(self._customHashPath):
			os.unlink(self._customHashPath)
