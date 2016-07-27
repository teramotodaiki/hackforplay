<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Record;
use DB;

class RecordController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $size = $request->has('size') ? $request->input('size') : 15;
      $records = Record::orderBy('time', 'desc');
      return response($records->simplePaginate($size), 200);
    }

    public function clear()
    {
      DB::table('records')->delete();
      return response([], 200);
    }
}
