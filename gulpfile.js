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

const bootstrap = 'node_modules/bootstrap/dist/js/bootstrap.js';
const jquery = 'node_modules/jquery/dist/jquery.js';
const tether = 'node_modules/tether/dist/js/tether.js';
const fontAwesome = 'node_modules/font-awesome/fonts';

elixir((mix) => {
  mix
    // Sass CSS
    .sass('app.scss')
    // browserify JS
    .browserify('app.js')
    // Versioning
    .version(['css/app.css', 'js/app.js'])
    // Bootstrap4
    // .scripts([
    //   tether,
    //   jquery,
    //   bootstrap
    // ], 'public/js/bootstrap4.0.0-alpha.2.js', './')
    // FontAwesome
    // .copy(fontAwesome, 'public/build/fonts')
;
});
