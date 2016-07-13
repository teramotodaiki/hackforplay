<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\Http\Middleware\SnakeCaseMiddleware;
use DB;

class StageController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $camel = SnakeCaseMiddleware::snakeToCamelRecursive($request->all());
      $stages = $this->query($camel);

      return response($stages, 200);
    }

    public function query($query)
    {
      $stages =
      Stage::orderBy('Published', 'desc')
      ->with('user')
      ->where('State', 'published');

      if (isset($query['is_clearable']) && !empty($query['is_clearable'])) {
        $stages->where('is_clearable', $query['is_clearable']);
      }

      $stages = $stages->paginate();

      foreach ($stages as $item) {
        $item->user;
        $item->clearcount =
        DB::table('PlayLog')
        ->where('StageID', $item->ID)
        ->whereNotNull('Cleared')
        ->count();
      }

      return $stages;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
