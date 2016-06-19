<?php
namespace App\Http\Controllers;

use Auth;

class DefaultAppController extends Controller
{

  function __construct()
  {
    // 旧仕様のセッションログインから、UserIDだけ拝借してUser情報を構築する
    $this->middleware(['auth.old']);
  }

  public function index()
  {
    // サーバーサイドでレンダリングしたい情報のみ、ここで処理する
    //  LaravelのControllerにはReactのパラメータを載せない
    //  必要なコンポーネントはView（blade）でHTMLに書き出す
    return view('defaultApp', ['user' => Auth::user()]);
  }
}


?>
