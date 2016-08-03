<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\User;
use App\Play;
use App\Http\Middleware\SnakeCaseMiddleware;
use DB;
use Carbon\Carbon;

class StageController extends Controller
{
    public function __construct()
    {
      $this->middleware('auth', ['only' => ['update']]);
      $this->middleware('cors', ['only' => ['show', 'play']]);
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

    public function indexByUser(Request $request, $id)
    {
      $this->validate($request, [
        'q' => 'max:1000',
      ]);

      $camel = SnakeCaseMiddleware::snakeToCamelRecursive($request->all());
      $camel['user'] = User::findOrFail($id)->ID;
      $stages = $this->query($camel);

      return response($stages, 200);
    }

    public function query($query)
    {
      $stages =
      Stage::orderBy('Published', 'desc')
      ->with('user', 'script')
      ->where('State', 'published');

      if (isset($query['user'])) {
        $stages->where('UserID', $query['user']);
      }

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
        $item->Playcount =
        $item->playcount = Play::where('stage_id', $item->ID)->count();
        $item->clearcount = Play::where(['stage_id' => $item->ID,'is_cleared' => 1])->count();
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
      $stage = Stage::with(['script'])->findOrFail($id);
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
        'published' => ['private'],
        'private'   => ['published'],
        'judging'   => ['pending'],
        'pending'   => ['judging'],
        'rejected'  => [],
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
     * Update stage.state by team administrator
    */
    public function judge(Request $request, $id)
    {
      $this->validate($request, [
        'state' => 'required|in:published,rejected'
      ]);

      $stage = Stage::findOrFail($id);
      if ($stage->team === null || !$request->user()->isConnected($stage->team)) {
        return response([ 'message' => 'team_not_connected' ], 200);
      }

      $transitions = [
        'published' => ['rejected'],
        'private'   => ['rejected'],
        'judging'   => ['published', 'rejected'],
        'pending'   => [],
        'rejected'  => [],
      ];

      if (!in_array($request->input('state'), $transitions[$stage->State])) {
        return response([ 'message' => 'state_not_allowed' ], 200);
      }

      $stage->State = $request->input('state');
      if ($request->has('reject_notice')) {
        $stage->RejectNotice = $request->input('reject_notice');
      }
      if ($stage->State === 'published') {
        $stage->Published = Carbon::now()->toDateTimeString();
      }
      $stage->save();

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

    public function play(Request $request, $id)
    {
      $this->validate($request, [
        'is_cleared' => 'boolean',
        'referrer' => 'url',
      ]);

      $stage = Stage::findOrFail($id);

      return $request->has('token') ?
        $this->gameOver($request, $stage) :
        $this->gameStart($request, $stage);
    }

    function gameStart(Request $request, $stage)
    {
      $play = $stage->plays()->create([
        'referrer' => $request->input('referrer'),
        'is_cleared' => 0,
      ]);
      $play->token = str_random(32);
      $play->user_id = $request->user() ? $request->user()->ID : null;
      $play->save();

      return response($play, 200);
    }

    function gameOver(Request $request, $stage)
    {
      $play = $stage->plays()
      ->where('token', $request->token)->firstOrFail();

      $auth = $request->user() ? $request->user()->ID : null;
      if ($play->user_id !== $auth) {
        return response([ 'message' => 'cant_update_play' ], 200);
      }

      $play->update($request->all());

      return response($play, 200);
    }
}
