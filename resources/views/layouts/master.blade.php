<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="pusher-key" content="{{ env('PUSHER_KEY') }}">
    @yield('ogp')
    <link rel="stylesheet" href="@yield('css')">
    @yield('wovn')
    @if (Auth::check() && isset($user))
      <meta name="login-user-id" content="{{ $user->ID }}">
    @endif
  </head>
  <body>
    @yield('ga')
    @yield('twitter')
    @yield('facebook')
    <div id="@yield('id')"></div>
    <script src="@yield('js')"></script>
  </body>
</html>
