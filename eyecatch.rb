serve 'php artisan serve'
port 8000

window_width 1200

before_build {
  run 'npm install'
  run 'composer install'
}
