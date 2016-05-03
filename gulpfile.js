const elixir = require('laravel-elixir');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

const bootstrap = 'node_modules/bootstrap/dist/';

elixir((mix) => {
  mix
    // Sass CSS
    .sass('app.scss')
    // browserify JS
    .browserify('app.js')
    // Versioning
    .version(['css/app.css', 'js/app.js']);
});
