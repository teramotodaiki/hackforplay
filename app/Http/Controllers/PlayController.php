<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
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
}
