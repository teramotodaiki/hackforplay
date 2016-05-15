<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class VerifyController extends Controller
{
  public function __construct()
  {
    $this->middleware('App\Http\Middleware\VerifyCsrfToken');
  }

  public function index(Request $request)
  {
    // Validaterを利用してパラメータごとの重複などを調べる
    $this->validate($request, [
      'login_id' => 'string|between:3,99|unique:account,email'
    ]);

    // 入力されたパラメータがチェックをパスした場合のみ、ステータスコード200を返す
    return response()->json([], 200);
  }

}
