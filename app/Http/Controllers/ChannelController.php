<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Channel;
use App\Project;
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

      $channel = Channel::create([
        'ProjectID'     => $project->ID,
        'ProjectToken'  => $request->input('project_token'),
        'UserID'        => $request->input('user_id'),
        'DisplayName'   => $request->input('display_name'),
        'Registered'    => Carbon::now(),
        'Updated'       => Carbon::now(),
      ]);
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
