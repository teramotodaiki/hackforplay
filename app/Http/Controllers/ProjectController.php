<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Project;
use App\Stage;
use App\Http\Middleware\SnakeCaseMiddleware;
use Carbon\Carbon;

class ProjectController extends Controller
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
      $this->validate($request, [
        'source_stage' => 'required|numeric'
      ]);

      $source = Stage::findOrFail($request->input('source_stage'));
      if ($source->NoRestage) {
        return response([
          'message' => 'not_allowed'
        ], 200);
      }

      $camel = SnakeCaseMiddleware::snakeToCamelRecursive($request->all());
      $project = Project::create($camel);

      // relation
      $project->UserID = $request->user()->ID;
      $project->RootID = $source->project ? $source->project->RootID : $project->ID;
      $project->ParentID = $source->project ? $source->project->ID : null;
      $project->SourceStageID = $source->ID;
      $project->Registered = Carbon::now()->toDateTimeString();
      $project->State = 'enabled';
      $project->Token = str_random(32);

      // reserved stage
      $reserved = $project->stages()->create([
        "UserID" => $request->user()->ID,
        "Mode" => 'replay',
        "ProjectID" => $project->ID,
        "State" => 'reserved',
        "SourceID" => $source->ID,
        "ImplicitMod" => $source->ImplicitMod,
      ]);

      $project->ReservedID = $reserved->ID;
      $project->save();

      return response($project, 200);
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
      $project = Project::where(
        ctype_digit((string) $id) ? 'id' : 'token',
        $id
      )->firstOrFail();

      $user = $request->user();
      if (!$project->isOwner($user)) {
        return response([
          'message' => 'cant_update_project',
        ], 200);
      }

      $camel = SnakeCaseMiddleware::snakeToCamelRecursive($request->all());
      $camel['Written'] = $request->has('script');
      $project->update($camel);

      $current = $project->scripts()->orderBy('id', 'desc')->first();

      if (  $request->has('script') &&
            $current->RawCode !== $camel['script']['raw_code'])
      {
        $current = $project->scripts()->create($camel['script']);
        $current->LineNum = substr_count($current->RawCode, "\n") + 1;
        $current->Registered = Carbon::now()->toDateTimeString();
        $current->save();
      }

      $project->current_script = $current;

      return response($project, 200);
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
