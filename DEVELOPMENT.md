# Development envoirment
* We manage javascript libraries with **Bower**
  1. Libraries are downloaded and extrated into ``Source/vendors/``
* We compile all files in the `Source` directory into multiple files with **Gulp**:
  1. LESS compiles into a combined LESS file for the template of Customization.
  1. LESS compiles into a CSS file used if Customization is disabled.
  1. JS files is combined into one file:
    - Core files is written to touchui.bundled.js
    - Libraries is written to touchui.libraries.js
    - Knockout is written to touchui.libraries.js


## Prerequisites
Install [NodeJS](http://www.nodejs.org/) and update NPM with ``sudo npm install npm -g``

1. Install required global NPM plguins:
```
(sudo) npm install -g less bower gulp
```

1. Install development dependencies
```
(sudo) npm install
(sudo) bower install
```

## Commands
- **Build all**  
Run `gulp`

- **Watch**  
Run `gulp watch`

- **LESS**  
Run `gulp less`  
This will concat all files in `source/less` to `touchui.bundled.less`

- **JS**  
Run `gulp js`  
This will concat all files in `source/js` to `touchui.bundled.js`/`touchui.libraries.js`/`touchui.knockout.js`
