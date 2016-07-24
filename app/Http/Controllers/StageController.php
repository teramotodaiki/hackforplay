<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\Http\Middleware\SnakeCaseMiddleware;
use DB;

class StageController extends Controller
{
    public function __construct()
    {
      $this->middleware('auth', ['only' => ['update']]);
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $this->validate($request, [
        'q' => 'max:1000',
      ]);

      $camel = SnakeCaseMiddleware::snakeToCamelRecursive($request->all());
      $stages = $this->query($camel);

      return response($stages, 200);
    }

    public function query($query)
    {
      $stages =
      Stage::orderBy('Published', 'desc')
      ->with('user', 'project')
      ->where('State', 'published');

      if (isset($query['is_clearable']) && !empty($query['is_clearable'])) {
        $stages->where('is_clearable', $query['is_clearable']);
      }

      if (isset($query['q'])) {
        foreach (mb_split("\s", urldecode($query['q'])) as $token) {
          $stages->where('title', 'like', "%$token%");
        }
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
      $stage = Stage::with('project')->findOrFail($id);
      return response($stage, 200);
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
      $stage = Stage::findOrFail($id);
      if ($request->user()->ID != $stage->UserID) {
        return response([ 'message' => 'cant_update_stage' ], 200);
      }

      $transitions = [
      	'published'  => ['private'],
      	'private'    => ['published'],
      	'judging'    => ['pending', 'rejected'],
      	'pending'    => ['judging']
      ];

      if ($request->has('state') &&
          !in_array($request->input('state'), $transitions[$stage->State])) {
        return response([ 'message' => 'state_not_allowed' ], 200);
      }

      $camel = SnakeCaseMiddleware::snakeToCamelRecursive($request->all());
      $stage->update($camel);

      return response($stage, 200);
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
