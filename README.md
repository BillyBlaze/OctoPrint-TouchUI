# OctoPrint-TouchUI 0.0.1 (beta)
This plugin will transform the OctoPrint layout into a Mobile/TFT friendly layout. With larger buttons and a responsive layout down to the smallest resolution possible. It will mimick pointer events as touch, so you can hook up those touchscreens. It also supports a virtual keyboard.

All these options are set clientside, so we won't interfere with other clients. All settings are stored in a delicious cookie for up to a year.

You can find the TouchUI settings in the `User settings` modal under `TouchUI`. Remember they're stored on your device, so if you login with your desktop computer you won't get the touch interface.

![TouchUI Interface](https://billyblaze.github.io/OctoPrint-TouchUI/images/touchui.gif)

## Setup

Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/BillyBlaze/OctoPrint-TouchUI/archive/master.zip

#### Additional step for the RaspberryPi
##### Automaticly boot into fullscreen mode with iceweasel:
1. [Make sure you boot to Desktop](https://www.raspberrypi.org/documentation/configuration/raspi-config.md)
2. [Autostart OctoPrint](https://github.com/foosel/OctoPrint/wiki/Setup-on-a-Raspberry-Pi-running-Raspbian)
3. run ``sudo apt-get install iceweasel``
4. run ``sudo nano /etc/xdg/lxsession/LXDE-pi/autostart``
5. Insert ````@iceweasel "http://localhost:5000/#touch"```` to the list
6. Now press ``Ctrl+X``, then ``Y`` and ``enter`` to save the changes
7. Open ``Iceweavel ``
8. Type in about:config in the address field and hit enter. Now find the ``browser.sessionstore.resume_from_crash`` line and double click to change it to false.
9. Go into fullscreen mode
10. Reboot and iceweavel should connect directly and in fullscreen

## Configuration
To active the touch interface open the OctoPrint interface with `#touch` at the end. Such as `http://myprinter.local/#touch`
Alternative you can toggle the touch interface within the `User settings` modal under `Plugins > TouchUI`.

## Supported browsers
1. Iceweasel
1. Chrome 30+
1. Firefox 40+
1. Safari Mobile
1. Chrome Mobile
