<?php
namespace App\Http\Controllers;

class DefaultAppController extends Controller
{

  function __construct()
  {

  }

  public function index()
  {
    // サーバーサイドでレンダリングしたい情報のみ、ここで処理する
    //  LaravelのControllerにはReactのパラメータを載せない
    //  必要なコンポーネントはView（blade）でHTMLに書き出す
    return view('defaultApp');
  }
}


?>
