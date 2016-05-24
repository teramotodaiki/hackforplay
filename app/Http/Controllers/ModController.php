<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Project;
use App\Script;

class ModController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        //
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

    function versioningConditions($version)
    {
      $versioner = [
        // * ... latest version
        '/^\*$/' => [
        ],
        // ~N ... latest version in N.*
        '/^\~([0-9])$/' => [
          ['MajorVersion', 1],
        ],
        // N.M ... N.M version stage
        '/^([0-9])\.([0-9])$/' => [
          ['MajorVersion', 1],
          ['MinorVersion', 2],
        ],
      ];

      $filtered = array_map(function ($regExp, $conditions) use ($version)
      {
        $matches = [];
        $flag = preg_match($regExp, $version, $matches);

        return $flag ?
        // 値を確定
        array_map(function ($condition) use ($matches)
        {
          // [Column, Value or Index]
          return is_int($condition[1]) ?
          [$condition[0], $matches[$condition[1]]] :
          $condition;

        }, $conditions) : null;

      }, array_keys($versioner), array_values($versioner));

      $conditions = array_filter($filtered);
      return array_shift($conditions);
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $name
     * @param  string  $version
     * @param  string  $ext
     * @return \Illuminate\Http\Response
     */
    public function showByProject($name, $version, $ext = '')
    {
      $project = Project::where('Token', $name)->firstOrFail();

      $conditions = $this->versioningConditions($version);
      if ($conditions === NULL) return response('NotFound', 404);

      // versioning
      $stages = array_reduce($conditions, function ($stages, $condition)
      {
        return $stages->where($condition[0], $condition[1]);
      },
      $project->stages());

      $stage = $stages->orderBy('ID', 'desc')->firstOrFail();

      // Script ID がない場合のための措置 (reserved stageにもScript IDを追加すべきか？)
      $rawcode = $stage->ScriptID ?
      $stage->script->RawCode :
      $project->scripts()->orderBy('ID', 'desc')->firstOrFail()->RawCode;

      // ImplicitModがある場合/ない場合
      // NOTE: 本来は ImplicitMod にもバージョンが必要
      $require = $stage->ImplicitMod ?
      "require('{$stage->ImplicitMod}');" :
      "";

      // no-dependencies
      $result = implode("\n", [
        "define(function (require, exports, module) {",
        $require,
        $rawcode,
        '});'
      ]);

      return response($result, 200)->header('Content-Type', 'application/javascript');
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $bundle
     * @param  string  $version
     * @param  string  $ext
     * @return \Illuminate\Http\Response
     */
    public function showByProduct($bundle, $version = '', $ext = '')
    {
      // Temporary implement
      $filepaths = [
        'hackforplay/hack'                => 'modules/hack.js',
        'hackforplay/rpg-kit-main'        => 'kit/rpg_hack_project/main.js',
        'hackforplay/rpg-kit-camera'      => 'kit/rpg_hack_project/camera.js',
        'hackforplay/rpg-kit-color'       => 'kit/rpg_hack_project/color.js',
        'hackforplay/rpg-kit-rpgobjects'  => 'kit/rpg_hack_project/rpgobjects.js',
        'hackforplay/rpg-kit-smartassets' => 'kit/rpg_hack_project/smartassets.js',
        'hackforplay/ap-kit-main'         => 'kit/ap_project/main.js',
        'hackforplay/commet-kit-main'     => 'kit/music_game_project/main.js',
        'hackforplay/survive-kit-main'    => 'kit/Tsuka_Project/main.js',
        'hackforplay/run-kit-main'        => 'lib/run.js',
        'hackforplay/typing-kit-main'     => 'lib/typing.js',
        'enchantjs/enchant'               => 'modules/enchant.js',
        'enchantjs/ui.enchant'            => 'modules/ui.enchant.js',
        'soundcloud/sdk-3.0.0'            => 'modules/sdk-3.0.0.js'
      ];

      if (!array_key_exists($bundle, $filepaths)) return response('Not Found', 404);

      // Document root
      $path = '../resources/views/vendor/hackforplay/embed/' . $filepaths[$bundle];
      if (!file_exists($path)) return response('Not Found', 404);

      $result = file_get_contents($path);
      return response($result, 200)
              ->header('Content-Type', 'application/javascript')
              ->header('Cache-Control', 'max-age=86400');

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
