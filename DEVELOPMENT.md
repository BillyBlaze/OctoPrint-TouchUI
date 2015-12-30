# Development envoirment
We compile all LESS to CSS with Gulp.

## Prerequisites
Install NodeJS (http://www.nodejs.org/) and update NPM with ``sudo npm install npm -g``

1. Install LESS
```
(sudo) npm install -g less
```

1. Install Bower
```
(sudo) npm install -g bower
```

1. Install Gulp
```
(sudo) npm install -g gulp
```

1. Install devDependencies
```
(sudo) npm install
(sudo) bower install
```

## Commands
- Build all  
Run `gulp`

- Watch  
Run `gulp watch`

- LESS  
Run `gulp less`
This will concat all files in `source/less` to `touchui.bundled.less`

- JS  
Run `gulp js`
This will concat all files in `source/js` to `touchui.bundled.js`
