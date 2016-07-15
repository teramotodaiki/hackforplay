<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\User;
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
        foreach ($emojis->lists('shortcode') as $sc) {
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
        'shortcode' => 'required|max:50'
      ]);

      $stage = Stage::findOrFail($stage);

      if ($stage->emojis->count() >= $this->maxEmojiNum) {
        return response([
          'message' => 'emoji_is_full',
        ], 200);
      }

      return response(
        $stage->emojis()->create([
          'user_id' => $request->user()->ID,
          'shortcode' => $request->input('shortcode'),
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
    public function show($id)
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
