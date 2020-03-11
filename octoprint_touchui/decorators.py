# coding=utf-8
from __future__ import absolute_import

from datetime import timedelta
from flask import make_response, request, current_app, abort
from functools import update_wrapper, wraps

try:
	from octoprint.access.permissions import Permissions
except:
	from octoprint.server import admin_permission

def touchui_admin_permission(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		try:
			plugin_permission = Permissions.SETTINGS.can()
		except:
			plugin_permission = admin_permission.can()

		if not plugin_permission:
			return abort(403)

		return f(*args, **kwargs)
	return decorated_function

def crossdomain(origin=None, methods=None, headers=None,
				max_age=21600, attach_to_all=True,
				automatic_options=True):

	# Py3 compatibility with Py2
	try:
		basestring
	except NameError:
		basestring = str

	if methods is not None:
		methods = ', '.join(sorted(x.upper() for x in methods))
	if headers is not None and not isinstance(headers, basestring):
		headers = ', '.join(x.upper() for x in headers)
	if not isinstance(origin, basestring):
		origin = ', '.join(origin)
	if isinstance(max_age, timedelta):
		max_age = max_age.total_seconds()

	def get_methods():
		if methods is not None:
			return methods

		options_resp = current_app.make_default_options_response()
		return options_resp.headers['allow']

	def decorator(f):
		def wrapped_function(*args, **kwargs):
			if automatic_options and request.method == 'OPTIONS':
				resp = current_app.make_default_options_response()
			else:
				resp = make_response(f(*args, **kwargs))
			if not attach_to_all and request.method != 'OPTIONS':
				return resp

			h = resp.headers

			h['Access-Control-Allow-Origin'] = origin
			h['Access-Control-Allow-Methods'] = get_methods()
			h['Access-Control-Max-Age'] = str(max_age)
			if headers is not None:
				h['Access-Control-Allow-Headers'] = headers
			return resp

		f.provide_automatic_options = False
		return update_wrapper(wrapped_function, f)
	return decorator
