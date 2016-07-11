<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\Project;
use DB;

class TmpPatchController extends Controller
{
  public function clearable()
  {
    $s_ids = DB::table('PlayLog')
    ->whereNotNull('Cleared')
    ->distinct()
    ->lists('StageID');

    Stage::whereIn('ID', $s_ids)
    ->update(['is_clearable' => 1]);

    return response($s_ids, 200);
  }

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

    DB::table('Stage')
    ->where('State', '!=', 'reserved')
    ->whereNull('MajorVersion')
    ->whereNotNull('ProjectID')
    ->chunk(100, function ($stages)
    {

      foreach ($stages as $stage) {

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
