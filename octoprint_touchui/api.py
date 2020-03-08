# coding=utf-8
from __future__ import absolute_import

from .decorators import crossdomain, touchui_admin_permission
from octoprint.server.util.flask import restricted_access

import octoprint.plugin
import octoprint.settings
import octoprint.util
import flask
import functools
import os

class touchui_api(octoprint.plugin.BlueprintPlugin):
	def increase_upload_bodysize(self, current_max_body_sizes, *args, **kwargs):
		return [("POST", r"/css", 1 * 1024 * 1024), ("GET", r"/css", 1 * 1024 * 1024)]

	@octoprint.plugin.BlueprintPlugin.route("/css", methods=["POST"])
	@restricted_access
	@touchui_admin_permission
	def saveCSS(self):
		if not "css" in flask.request.values:
			return flask.make_response("Expected a CSS value.", 400)

		try:
			self._save_custom_css(flask.request.values["css"])

		except Exception as e:
			self._logger.warn("Exception while generating LESS file: {message}".format(message=str(e)))
			return flask.make_response(str(e), 400)

		return flask.make_response("Ok.", 200)

	@octoprint.plugin.BlueprintPlugin.route("/css", methods=["GET"])
	@restricted_access
	@touchui_admin_permission
	def getCSS(self):
		data = ""

		if not "path" in flask.request.values:
			return flask.make_response("Expected a path value.", 400)

		try:
			with open(flask.request.values["path"], 'r') as contentFile:
				data = contentFile.read()

		except Exception as e:
			self._logger.warn("Exception while generating LESS file: {message}".format(message=str(e)))
			return flask.make_response(str(e), 400)

		return flask.make_response(data, 200)

	@octoprint.plugin.BlueprintPlugin.route("/ping", methods=["GET"])
	@crossdomain(origin='*')
	def ping(self):
		return flask.make_response("Ok.", 200)

	def is_blueprint_protected(self):
		return False
