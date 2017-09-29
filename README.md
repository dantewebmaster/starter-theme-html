# Starter Theme HTML
This is a starter theme with all my initial setup for static HTML projects. Required node.js to run tasks with Gulp. This theme have all necessary gulp plugins and tasks to run a local server, auto reload the browser on code change, minify and concatenate html/css/js and optimize all project images.

## Required
* node.js
* gulp

## Project Init
1. Clone this repo
2. Open another CMD and run `npm install`
3. Run `gulp` to start watching files (.scss, .html, .js)
4. To create the dist directory with minified .html, .css and .js, and optmized images run the comand `gulp build`

## Dependencies
* gulp
* browser-sync
* gulp-sass
* gulp-uglify
* gulp-htmlmin
* gulp-cssnano
* gulp-imagemin
* gulp-useref
* run-sequence
* gulp-autoprefixer
* gulp-cache
* gulp-if
* del
* gulp-plumber
* gulp-notify

### Changelog
**26/09/2017 - v1.0.2** - Adicionado notificações de erro/sucesso ao compilar arquivo sass.
