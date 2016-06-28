{{-- Default React App --}}

@extends('layouts/master')

@section('ogp')

  <meta property="og:title" content="{{ $title or 'HackforPlay' }}" />
  <meta property="og:type" content="{{ $type or 'website' }}" />
  <meta property="og:url" content="{{ $url or url()->full() }}" />
  <meta property="og:image" content="{{ $image or 'img/1024/topback.jpg' }}" />

@endsection

@section('css', elixir('css/app.css'))
@section('js',  elixir('js/app.js'))

@section('id', 'app')

@section('ga')
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-57860455-1', 'auto');
    ga('send', 'pageview');

  </script>
@endsection

@section('wovn')
  <script src="//j.wovn.io/1" data-wovnio="key=FgyZa" async></script>
@endsection
