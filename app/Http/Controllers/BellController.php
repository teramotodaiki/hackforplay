<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Team;
use App\Bell;
use App\Channel;

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
    public function storeWithTeam(Request $request, $team_id)
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

      $channel = $request->input('channel') ? (
        Channel::where(
          ctype_digit((string)$request->input('channel')) ? 'id' : 'name',
          $request->input('channel')
        )->firstOrFail()
      ) : NULL;

      $bell = $team->bells()
      ->create([
        'user_id' => $user->ID,
        'channel_id' => $channel ? $channel->ID : NULL,
        'qcard_id' => $request->input('qcard'),
      ]);

      try {
        // slack notification
        $qcard = $request->input('qcard');
        $qcardUrl = url("qcards/{$qcard}/view");
        $text = ":bellhop_bell::point_right:{$user->Nickname}{$qcardUrl}";

        $this->postToSlack([$text], $team);

      } catch (Exception $e) {
        return response($e, 200);
      }

      return response($bell, 200);
    }

    public function postToSlack($texts, $team)
    {
      $api = "https://slack.com/api/chat.postMessage?token={$team->slack_api_token}&channel={$team->slack_channel_name}&as_user=true";

      foreach ($texts as $item) {
        if (!$item) continue;

        $text = urlencode($item);
        file_get_contents($api . '&text=' . $text);
      }
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
