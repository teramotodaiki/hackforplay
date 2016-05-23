<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;

class TmpPatchController extends Controller
{
  public function implictMod()
  {
    // Src => mod
    $mods = [
      '/kit/rpg_hack_project/index.php'   => 'hackforplay/rpg-kit-main',
      '/kit/ap_project/index.php'         => 'hackforplay/ap-kit-main',
      '/kit/music_game_project/index.php' => 'hackforplay/commet-kit-main',
      '/kit/Tsuka_Project/index.php'      => 'hackforplay/survive-kit-main',

      'kit/rpg_hack_project/index.php'   => 'hackforplay/rpg-kit-main',
      'kit/ap_project/index.php'         => 'hackforplay/ap-kit-main',
      'kit/music_game_project/index.php' => 'hackforplay/commet-kit-main',
      'kit/Tsuka_Project/index.php'      => 'hackforplay/survive-kit-main',
      'run.php'                           => 'hackforplay/run-kit-main',
      'typing.php'                        => 'hackforplay/typing-kit-main',
    ];

    foreach ($mods as $src => $mod) {

      Stage::where('Src', $src)->update(['ImplictMod' => $mod]);

    }

    return response('success', 200);
  }

  public function versioning()
  {
    
  }
}
