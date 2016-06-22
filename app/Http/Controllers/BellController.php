<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Team;
use App\Bell;

class BellController extends Controller
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

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, $team_id)
    {
      $team = Team::where(
        ctype_digit((string)$team_id) ? 'id' : 'name',
        $team_id
      )->firstOrFail();

      $user = $request->user();
      if (!$user->isConnected($team)) {
        return response([
          'error' => 'not_in_team'
        ], 403);
      }

      $bell = $team->bells()
      ->create([
        'user_id' => $user->ID,
      ]);

      try {
        // slack notification
        $text = ":bellhop_bell::point_right:{$user->Nickname}";
        $text = urlencode($text);
        $url = "https://slack.com/api/chat.postMessage?token={$team->slack_api_token}&channel={$team->slack_channel_name}&text=$text&as_user=true";

        file_get_contents($url);

      } catch (Exception $e) {
        return response($e, 200);
      }

      return response($bell, 200);
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
