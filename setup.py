# coding=utf-8

plugin_identifier = "touchui"
plugin_package = "octoprint_touchui"
plugin_name = "TouchUI"
plugin_version = "0.0.1"
plugin_description = """A touch friendly interface for a small TFT modules and or phones"""
plugin_author = "Paul de Vries"
plugin_author_email = "pablo+octoprint+touch+ui@aerosol.me"
plugin_url = "https://github.com/BillyBlaze/OctoPrint-TouchUI"
plugin_license = "AGPLv3"
plugin_requires = []
plugin_additional_data = []
plugin_addtional_packages = []
plugin_ignored_packages = []
additional_setup_parameters = {}

from setuptools import setup

try:
	import octoprint_setuptools
except:
	print("Could not import OctoPrint's setuptools, are you sure you are running that under "
	      "the same python installation that OctoPrint is installed under?")
	import sys
	sys.exit(-1)

setup_parameters = octoprint_setuptools.create_plugin_setup_parameters(
	identifier=plugin_identifier,
	package=plugin_package,
	name=plugin_name,
	version=plugin_version,
	description=plugin_description,
	author=plugin_author,
	mail=plugin_author_email,
	url=plugin_url,
	license=plugin_license,
	requires=plugin_requires,
	additional_packages=plugin_addtional_packages,
	ignored_packages=plugin_ignored_packages,
	additional_data=plugin_additional_data,
	requires=[
		"OctoPrint>=1.2.4"
	]
)

if len(additional_setup_parameters):
	from octoprint.util import dict_merge
	setup_parameters = dict_merge(setup_parameters, additional_setup_parameters)

setup(**setup_parameters)
