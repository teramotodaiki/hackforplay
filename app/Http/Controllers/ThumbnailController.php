<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;

class ThumbnailController extends Controller
{
  /**
   * base64形式の文字列データを受け取り、
   * Azure Blob Storageにアップロードしたあと、
   * そのリソースのURLを返す
   */
  public function store(Request $request)
  {
    $this->validate($request, [
      'data_url' => 'required',
    ]);

    $blobRestProxy = ServicesBuilder::getInstance()->createBlobService(env('BLOB_CONNECTION', ''));

    //ヘッダに「data:image/png;base64,」が付いているので、それは外す
    $base64 = explode(',', $request->input('data_url'))[1];

    //残りのデータはbase64エンコードされているので、デコードする
  	$content = base64_decode($base64);

    $blob_name = str_random(32) . '.png';

    try {
      //Upload blob
      $blobRestProxy->createBlockBlob(env('BLOB_CONTAINER'), $blob_name, $content);
    }
    catch(ServiceException $e){
      // // Handle exception based on error codes and messages.
      // // Error codes and messages are here:
      // // http://msdn.microsoft.com/library/azure/dd179439.aspx
      // $code = $e->getCode();
      // $error_message = $e->getMessage();
      return response(['message' => 'upload_blob_error'], 500);
    }

    return response([
      'url' =>  env('BLOB_URL') . '/' .
                  env('BLOB_CONTAINER') . '/' .
                    $blob_name
    ], 200);
  }
}
