# OctoPrint-TouchUI 0.0.1
##Currently in production; do not install untill atleast 0.1.0
This plugin will transform the layout in a Touch/TFT friendly layout. With larger buttons and a responsive layout down to the smallest resolution possible.

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
9. Go into fullscreen mode (Toggle fullscreen within the `User settings` modal under `Plugins > TouchUI`)
10. Reboot and iceweavel should connect directly and in fullscreen

## Configuration
To active the touch interface open the OctoPrint interface with '#touch' at the end. Such as `http://192.168.1.255:5000/#touch`
Alternative you can toggle the touch interface within the `User settings` modal under `Plugins > TouchUI`.

Activating touch will set a cookie on the client so it will remember to active the touch interface (up to a year).

## Supported browsers
1. Firefox/Iceweasel
2. Chrome 30+
3. ....
