<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Stage;
use App\Project;
use App\Author;
use App\Script;
use DB;

class TmpPatchController extends Controller
{
  public function enchantjsModPlug() {
    $prefix = '/resources/statics/enchant.js-builds-0.8.3/build/';
    $mods = [
      // label => source path
      'enchant' => 'enchant.js',
      'avatar.enchant' => 'plugins/avatar.enchant.js',
      'box2d.enchant' => 'plugins/box2d.enchant.js',
      'collada.gl.enchant' => 'plugins/collada.gl.enchant.js',
      'extendMap.enchant' => 'plugins/extendMap.enchant.js',
      'gl.enchant' => 'plugins/gl.enchant.js',
      'memory.enchant' => 'plugins/memory.enchant.js',
      'mixing.enchant' => 'plugins/mixing.enchant.js',
      'mmd.gl.enchant' => 'plugins/mmd.gl.enchant.js',
      'nineleap.enchant' => 'plugins/nineleap.enchant.js',
      'physics.gl.enchant' => 'plugins/physics.gl.enchant.js',
      'primitive.gl.enchant' => 'plugins/primitive.gl.enchant.js',
      'socket.enchant' => 'plugins/socket.enchant.js',
      'telepathy.enchant' => 'plugins/telepathy.enchant.js',
      'tl.enchant' => 'plugins/tl.enchant.js',
      'twitter.enchant' => 'plugins/twitter.enchant.js',
      'ui.enchant' => 'plugins/ui.enchant.js',
      'util.enchant' => 'plugins/util.enchant.js',
      'widget.enchant' => 'plugins/widget.enchant.js',
      'wiiu.enchant' => 'plugins/wiiu.enchant.js',
    ];

    // make author
    $author = Author::where('name', 'enchant.js-0.8.3')->first();
    if ($author === null) {
      $author = Author::create([ 'name' => 'enchant.js-0.8.3' ]);
    }

    // make
    foreach ($mods as $key => $value) {
      $already = $author->plugs->where('label', $key)->first();
      if ($already !== null) $already->delete();

      $author->plugs()->create([
        'stage_id' => $this->makeScriptStage(base_path($prefix . $value))->ID,
        'label' => $key,
      ]);
    }

    return response($author->plugs->all(), 200);
  }

  public function hackforplayModPlug() {
    $prefix = '/resources/statics/hackforplay-old/';
    $mods = [
      // label => source file path
      'hack'                => 'modules/hack.js',
      'rpg-kit-main'        => 'kit/rpg_hack_project/main.js',
      'rpg-kit-camera'      => 'kit/rpg_hack_project/camera.js',
      'rpg-kit-color'       => 'kit/rpg_hack_project/color.js',
      'rpg-kit-rpgobjects'  => 'kit/rpg_hack_project/rpgobjects.js',
      'rpg-kit-smartassets' => 'kit/rpg_hack_project/smartassets.js',
      'ap-kit-main'         => 'kit/ap_project/main.js',
      'commet-kit-main'     => 'kit/music_game_project/main.js',
      'survive-kit-main'    => 'kit/Tsuka_Project/main.js',
      'run-kit-main'        => 'lib/run.js',
      'typing-kit-main'     => 'lib/typing.js',
      'enchantjs-kit'       => 'modules/enchantjs-kit.js',
    ];

    // make author
    $author = Author::where('name', 'hackforplay')->first();
    if ($author === null) {
      $author = Author::create([ 'name' => 'hackforplay' ]);
    }

    // make
    foreach ($mods as $key => $value) {
      $already = $author->plugs->where('label', $key)->first();
      if ($already !== null) $already->delete();

      $author->plugs()->create([
        'stage_id' => $this->makeScriptStage(base_path($prefix . $value))->ID,
        'label' => $key,
      ]);
    }

    return response($author->plugs->all(), 200);
  }

  protected function makeScriptStage($basepath)
  {
    return Stage::create([
      'ScriptID' => Script::create([
          'RawCode' => file_get_contents($basepath)
        ])->id,
      'State' => 'private',
      'NoRestage' => 1,
    ]);
  }

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
