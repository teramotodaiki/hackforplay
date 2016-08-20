<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

class ThumbnailController extends Controller
{
  /**
   * base64形式の文字列データを受け取り、
   * Azure Blob Storageにアップロードしたあと、
   * そのリソースのURLを返す
   */
  public function store(Request $request)
  {
    return response([], 200);
  }
}
