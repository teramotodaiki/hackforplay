const elixir = require('laravel-elixir');

// Add envify (convert NODE_ENV in production) to browserify
// ...use browserify2
require('./elixir-extention');

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

const fontAwesome = 'node_modules/font-awesome/fonts';

elixir((mix) => {
  mix
    // Sass CSS
    .sass('app.scss')
    // browserify JS
    .browserify2('app.js')
    // Versioning
    .version(['css/app.css', 'js/app.js'])
    // FontAwesome
    // .copy(fontAwesome, 'public/build/fonts/font-awesome')
    // PixelMplus
    // .copy('vendor/PixelMplus', 'public/build/fonts/PixelMplus')
;
});
