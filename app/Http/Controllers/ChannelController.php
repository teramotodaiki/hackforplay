<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Channel;
use App\Project;
use App\Team;
use App\User;
use Carbon\Carbon;

class ChannelController extends Controller
{
    public function __construct()
    {
      $this->middleware('create', ['only' => ['auth']]);
    }

    /**
     * Get all channels user can watch
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $query = (object) array_merge($request->all(), [
        'user' => $request->user(),
      ]);
      $channels = $this->query($query);
      return response($channels, 200);
    }

    public function indexWithProject(Request $request, $project)
    {
      $project = Project::where(
        ctype_digit((string)$project) ? 'id' : 'token',
        $project
      )->firstOrFail();

      $query = (object) array_merge($request->all(), [
        'user'    => $request->user(),
        'project' => $project,
      ]);
      $channels = $this->query($query);
      return response($channels, 200);
    }

    public function query($query)
    {
      $user = $query->user;
      $channels = Channel::orderBy('updated_at', 'desc')->with('user');
      if ($user) {
        $connected_teams = [];
        foreach ($user->teams as $team) {
          if ($team->pivot->Enabled) {
            array_push($connected_teams, $team->ID);
          }
        }
        $channels = $channels->whereIn('TeamID', $connected_teams);
      } else {
        $channels = $channels->whereNull('TeamID');
      }

      if (isset($query->project)) {
        $channels->where('ProjectID', $query->project->ID);
      }

      if (isset($query->is_private)) {
        $channels = $channels->where('is_private', $query->is_private);
      }
      if (isset($query->is_archived)) {
        $channels = $channels->where('is_archived', $query->is_archived);
      }

      if (isset($query->since)) {
        $channels = $channels->where('updated_at', '>=', $query->since);
      }

      foreach ($channels as $channel) {
        $channel->user;
      }

      return $channels->paginate();
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
      return view('defaultApp', ['user' => $request->user()]);
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

      $headScript = $project->scripts()->orderBy('ID', 'DESC')->first();

      $channel = Channel::create([
        'ProjectID'     => $project->ID,
        'ProjectToken'  => $request->input('project_token'),
        'UserID'        => $user ? $user->ID : null,
        'DisplayName'   => $request->input('display_name'),
        'Registered'    => Carbon::now(),
        'Updated'       => Carbon::now(),
        'TeamID'        => $team ? $team->ID : null,
        'description'   => $request->input('description'),
        'Thumbnail'     => $headScript ? $headScript->Thumbnail : null,
      ]);
      $channel->script = $headScript;

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
