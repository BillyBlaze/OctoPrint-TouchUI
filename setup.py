# coding=utf-8

plugin_identifier = "touchui"
plugin_package = "octoprint_touchui"
plugin_name = "TouchUI"
plugin_version = "0.3.11"
plugin_description = """A touch friendly interface for a small TFT modules and or phones"""
plugin_author = "Paul de Vries"
plugin_author_email = "pablo+octoprint+touch+ui@aerosol.me"
plugin_url = "https://github.com/BillyBlaze/OctoPrint-TouchUI"
plugin_license = "AGPLv3"
plugin_requires = ["OctoPrint>=1.2.4"]
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
	additional_data=plugin_additional_data
)

if len(additional_setup_parameters):
	from octoprint.util import dict_merge
	setup_parameters = dict_merge(setup_parameters, additional_setup_parameters)

setup(**setup_parameters)

try:
	import os
	fileOut = "./octoprint_touchui/WHATSNEW.md"
	fileIn = "./WHATSNEW.md"

	if os.path.isfile(fileOut):
		os.unlink(fileOut)

	with open(fileIn, 'r') as contentFile:
		whatsNew = contentFile.read()

	with open(fileOut, "w+") as writeFile:
		writeFile.write('{WHATSNEW}'.format(WHATSNEW=whatsNew))

except Exception as e:
	print("\nCopying the WHATSNEW.md failed, however it shouldn't matter, just read the release notes on github if you like.\nThe error: {message}".format(message=str(e)))
