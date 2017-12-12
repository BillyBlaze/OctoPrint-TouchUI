# OctoPrint-TouchUI 0.3.11
This plugin will transform the OctoPrint layout into a Mobile/TFT friendly layout. With larger buttons and a responsive layout down to the smallest resolution possible. It will mimic pointer events as touch, so you can hook up those touchscreens. It also supports a virtual keyboard.

All these settings are set client-side, so we won't interfere with other clients. All settings are stored in your localstorage or as a delicious cookie. You can find the `TouchUI settings` in a dedicated modal. Remember they're stored on your device, so if you login with your desktop computer you won't get the touch interface.

![TouchUI Interface](https://billyblaze.github.io/OctoPrint-TouchUI/images/touchui-v030.gif)

## Setup
Install via the bundled [Plugin Manager](https://github.com/foosel/OctoPrint/wiki/Plugin:-Plugin-Manager)
or manually using this URL:

    https://github.com/BillyBlaze/OctoPrint-TouchUI/archive/master.zip

- **Touchscreens**  
Read more about [setting up a touchscreen](https://github.com/BillyBlaze/OctoPrint-TouchUI/wiki/Setup#raspberrypi--touchscreen) on our Wiki.

## Configuration
The interface will automatically start when your browser is smaller then 980 pixels in width or if you're browsing with a touch device. You can turn this manually on and off in the ``TouchUI settings`` modal. Alternatively you can force TouchUI to load by adding ``#touch`` on the end of your URL.

Read more [configuration options](https://github.com/BillyBlaze/OctoPrint-TouchUI/wiki/Configuration) on our Wiki.

- **Customization**  
You can change 4 main colors of the interface with the power of LESS. If you would like to change more colors, then you're free to add your own LESS file. [Read more about this and the variables](https://github.com/BillyBlaze/OctoPrint-TouchUI/wiki/Customize:-Use-your-own-file) on our wiki.

## Supported browsers
1. Chrome 30+
1. Firefox 40+
1. Safari Mobile
1. Chrome Mobile
