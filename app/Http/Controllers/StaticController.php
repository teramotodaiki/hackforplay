<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class StaticController extends Controller
{
  public function __construct()
  {
    $this->root = base_path('resources/statics/');
  }

  /**
   * @param $path file path from
   */
  public function index($path)
  {
    $filepath =  "{$this->root}{$path}";
    $pathinfo = pathinfo($path);

    if (empty($pathinfo['extension'])) {
      return response('', 404);
    }
    if (!file_exists($filepath)) {
      return response('', 404);
    }

    $type = [
      'txt' => 'text/plain',
      'htm' => 'text/html',
      'html' => 'text/html',
      'css' => 'text/css',
      'js' => 'application/javascript',
      'json' => 'application/json',
      'xml' => 'application/xml',
      // images
      'png' => 'image/png',
      'jpeg' => 'image/jpeg',
      'jpg' => 'image/jpeg',
      'gif' => 'image/gif',
      'ico' => 'image/vnd.microsoft.icon',
      // audio/video
      'mp3' => 'audio/mpeg',
      'wav' => 'audio/wav',
    ][$pathinfo['extension']];

    $content = file_get_contents($filepath);

    return response($content, 200)
            ->header('Content-Type', $type);
  }
}
