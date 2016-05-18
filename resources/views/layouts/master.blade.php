<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# article: http://ogp.me/ns/article#">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @yield('ogp')
    <link rel="stylesheet" href="@yield('css')">
    @yield('wovn')
  </head>
  <body>
    @yield('ga')
    <div id="@yield('id')"></div>
    <script src="@yield('bootstrap')"></script>
    <script src="@yield('js')"></script>
  </body>
</html>
