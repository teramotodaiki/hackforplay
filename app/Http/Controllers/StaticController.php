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

    if (!file_exists($filepath)) {
      return response('', 404);
    }

    $content = file_get_contents($filepath);

    return response($content, 200);
  }
}
