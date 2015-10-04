---
layout: plugin

id: touchui
title: TouchUI
description: A touch friendly interface for Mobile and TFT touch modules
author: Paul de Vries
license: AGPLv3
date: 2015-10-04

homepage: https://billyblaze.github.io/OctoPrint-TouchUI
source: https://github.com/BillyBlaze/OctoPrint-TouchUI
archive: https://github.com/BillyBlaze/OctoPrint-TouchUI/archive/master.zip
follow_dependency_links: false

# TODO
tags:
- ui
- touchscreen
- mobile

# TODO
screenshots:
- url: url of a screenshot
  alt: alt-text of a screenshot
  caption: caption of a screenshot
- url: url of another screenshot
  alt: alt-text of another screenshot
  caption: caption of another screenshot
- ...

# TODO
featuredimage: https://billyblaze.github.io/OctoPrint-TouchUI/images/touchuisample.png

compatibility:
  # list of compatible versions, for example 1.2.0. If left empty no specific version requirement will be assumed
  octoprint:
  - 1.2.6

  # list of compatible operating systems, valid values are linux, windows, macos, leaving empty defaults to all
  browsers:
  - Iceweavel
  - Chrome 44+
  - Firefox 40+
  - IE Edge
  - Safari (mobile)
  - Chrome (mobile)
---
This plugin will transform the OctoPrint layout into a Mobile/TFT friendly layout. With larger buttons and a responsive layout down to the smallest resolution possible. It will mimick pointer events as touch, so you can hook up those touchscreens. It also supports a virtual keyboard.

All these options are set clientside, so we won't interfere with other clients. All settings are stored in a delicious cookie for up to a year.

You can find the TouchUI settings in the `User settings` modal under `Plugins > TouchUI`. Remember this are stored on your device, so if you login with your desktop computer you won't get the touch interface.

![TouchUI Interface](https://billyblaze.github.io/OctoPrint-TouchUI/images/touchui.gif)
