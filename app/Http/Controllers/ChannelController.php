<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Channel;
use App\Project;
use App\Team;
use Carbon\Carbon;

class ChannelController extends Controller
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
        'project_token' => 'required'
      ]);
      // get project id from token
      $project = Project::where('Token', $request->input('project_token'))
        ->firstOrFail();

      $user = $request->user();
      $team = $request->has('team') ? Team::where(
        ctype_digit((string)$request->input('team')) ? 'id' : 'name',
        $request->input('team')
      )->firstOrFail() : null;

      if ($user && $team && !$user->isConnected($team)) {
        return response([
          'message' => 'not_in_team',
        ], 403);
      }

      $channel = Channel::create([
        'ProjectID'     => $project->ID,
        'ProjectToken'  => $request->input('project_token'),
        'UserID'        => $user ? $user->ID : null,
        'DisplayName'   => $request->input('display_name'),
        'Registered'    => Carbon::now(),
        'Updated'       => Carbon::now(),
        'TeamID'        => $team ? $team->ID : null,
        'description'   => $request->input('description'),
      ]);
      $channel->script = $channel->project->scripts()->orderBy('ID', 'DESC')->first();

      return response($channel, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
      $channel = Channel::findOrFail($id);
      if ($request->input('chats')) {
        $channel->chats;
      }
      $channel->script = $channel->project->scripts()->orderBy('ID', 'DESC')->first();
      return response($channel, 200);
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
