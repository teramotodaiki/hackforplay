<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Play;
use App\Stage;

class PlayController extends Controller
{
  public function storeByStage(Request $request, $id)
  {
    $this->validate($request, [
      'referrer' => 'url',
    ]);

    $stage = Stage::findOrFail($id);

    $play = $stage->plays()->create([
      'referrer' => $request->input('referrer'),
      'is_cleared' => 0,
    ]);
    $play->token = str_random(32);
    if ($request->user()) {
      $play->user_id = $request->user()->ID;
    }
    $play->save();

    return response($play, 200);
  }

  public function update(Request $request, $token)
  {
    $this->validate($request, [
      'is_cleared' => 'boolean',
      'referrer' => 'url',
    ]);

    $play = Play::where('token', $token)->firstOrFail();

    $auth = $request->user() ? $request->user()->ID : null;
    if ($play->user_id && $play->user_id !== $auth) {
      return response([ 'message' => 'cant_update_play' ], 200);
    }

    $play->update($request->all());

    return response($play, 200);
  }
}
