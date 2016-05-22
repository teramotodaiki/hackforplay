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

    /**
     * Display the specified resource.
     *
     * @param  string  $bundle
     * @param  string  $name
     * @param  string  $ext
     * @return \Illuminate\Http\Response
     */
    public function show($bundle, $name, $ext = '')
    {
      // Temporary implement
      $result = $bundle === '~project' ?
        $this->showByProject($name) :
        $this->showByProduct($bundle, $name);

      return response($result, 200)->header('Content-Type', 'application/javascript');
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $name
     * @param  string  $ext
     * @return \Illuminate\Http\Response
     */
    public function showByProject($name, $ext = '')
    {
      // Temporary implement
      $project = Project::where('Token', $name)->firstOrFail();
      $script = $project->scripts()->orderBy('ID', 'desc')->firstOrFail();
      $dependency = 'hackforplay/rpg-kit-main'; // Temporary

      // no-dependencies
      $result = implode("\n", [
        "define(function (require, exports, module) {",
        "require('{$dependency}');",
        $script->RawCode,
        '});'
      ]);

      return response($result, 200)->header('Content-Type', 'application/javascript');
    }

    /**
     * Display the specified resource.
     *
     * @param  string  $bundle
     * @param  string  $ext
     * @return \Illuminate\Http\Response
     */
    public function showByProduct($bundle, $ext = '')
    {
      // Temporary implement
      $filepaths = [
        'hackforplay/hack'                => 'modules/hack.js',
        'hackforplay/rpg-kit-main'        => 'kit/rpg_hack_project/main.js',
        'hackforplay/rpg-kit-camera'      => 'kit/rpg_hack_project/camera.js',
        'hackforplay/rpg-kit-color'       => 'kit/rpg_hack_project/color.js',
        'hackforplay/rpg-kit-rpgobjects'  => 'kit/rpg_hack_project/rpgobjects.js',
        'hackforplay/rpg-kit-smartassets' => 'kit/rpg_hack_project/smartassets.js',
        'enchantjs/enchant'               => 'modules/enchant.js',
        'enchantjs/ui.enchant'            => 'modules/ui.enchant.js',
        'soundcloud/sdk-3.0.0'            => 'modules/sdk-3.0.0.js'
      ];

      if (!array_key_exists($bundle, $filepaths)) return response('Not Found', 404);

      // Document root
      $path = '../resources/views/vendor/hackforplay/embed/' . $filepaths[$bundle];
      if (!file_exists($path)) return response('Not Found', 404);

      $result = file_get_contents($path);
      return response($result, 200)->header('Content-Type', 'application/javascript');

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
