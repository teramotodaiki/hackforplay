<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\Project;

class TmpPatchController extends Controller
{
  public function implicitMod()
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

      Stage::where('Src', $src)->update(['ImplicitMod' => $mod]);

    }

    return response('success', 200);
  }

  public function versioning()
  {

    // Minor versioning
    // Stage::where('State', '!=', 'reserved')->update(['MinorVersion' => 0]);
    Stage::where('State', '!=', 'reserved')->update(['MajorVersion' => 0]);


    Stage::chunk(100, function ($stages)
    {
      $yet = $stages->whereNull('MajorVersion')->get();
      foreach ($yet as $stage) {

        $postedStages = Project::find($stage->ProjectID)
        ->stages()
        ->where('State', '!=', 'reserved')
        ->orderBy('ID')
        ->get();

        $version = 0;
        foreach ($postedStages as $posted) {

          $posted->MajorVersion = ++$version;
          $posted->save();

        }

      }
    });

    return response('success', 200);
  }
}
