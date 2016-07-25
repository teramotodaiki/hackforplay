<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\User;
use App\Emoji;
use Carbon\Carbon;

class EmojiController extends Controller
{
    public function __construct()
    {
      $this->middleware('auth', ['only' => ['store', 'destroy']]);

      $this->maxEmojiNum = 10;
    }
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, $stage)
    {
      $this->validate($request, [
        'user' => 'numeric',
        'summary' => 'boolean',
      ]);

      $emojis = Stage::findOrFail($stage)->emojis();

      if ($request->has('user')) {
        $user = User::findOrFail($request->input('user'));
        $emojis->where('user_id', $user->ID);
      }

      if ($request->input('summary')) {
        $summary = [];
        foreach ($emojis->lists('shortname') as $sc) {
          $summary[$sc] = (isset($summary[$sc]) ? $summary[$sc] : 0) + 1;
        }
        return response($summary, 200);
      }

      return response($emojis->paginate(), 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $stage)
    {
      $this->validate($request, [
        'shortname' => 'required|max:50'
      ]);

      $stage = Stage::findOrFail($stage);
      $thrown = $stage->emojis->where('user_id', $request->user()->ID);

      if ($thrown->count() >= $this->maxEmojiNum) {
        return response([
          'message' => 'emoji_is_full',
        ], 200);
      }

      return response(
        $stage->emojis()->create([
          'user_id' => $request->user()->ID,
          'shortname' => $request->input('shortname'),
          'created_at' => Carbon::now()->toDateTimeString(),
        ]
      ), 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $stage, $id)
    {
      return response(Emoji::findOrFail($id), 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $stage, $id)
    {
      $emoji = Emoji::findOrFail($id);

      if (+$emoji->user_id !== +$request->user()->ID) {
        return response([
          'message' => 'cant_delete_emoji',
        ], 200);
      }

      $emoji->delete();
      return response([], 200);
    }
}
