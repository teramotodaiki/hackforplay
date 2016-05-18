<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="stylesheet" href="@yield('css')">
  </head>
  <body>
    @yield('ga')
    <div id="@yield('id')"></div>
    <script src="@yield('bootstrap')"></script>
    <script src="@yield('js')"></script>
    @yield('wovn')
  </body>
</html>
