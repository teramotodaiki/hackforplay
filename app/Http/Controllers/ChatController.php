<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Channel;
use App\Chat;
use Carbon\Carbon;
use Pusher;

class ChatController extends Controller
{
    function __construct()
    {
      // pusher
      $this->pusher = new Pusher(
        env('PUSHER_KEY'),
        env('PUSHER_SECRET'),
        env('PUSHER_APP_ID'),
        [
          'encrypted' => true
        ]
      );
    }

    /**
     * Display a listing of the resource.
     *
     * @param int $channelId
     * @return \Illuminate\Http\Response
     */
    public function index($channelId)
    {
      $chats = Channel::findOrFail($channelId)->chats;
      return response($chats, 200);
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
     * @param int $channelId
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store($channelId, Request $request)
    {
      $channel = Channel::findOrFail($channelId);

      // Store message
      $chat = $channel
      ->chats()
      ->create([
        'message' => $request->input('message'),
      ]);

      // Push message
      $this->pusher->trigger('channel-' . $channelId, 'new_message', $chat);

      // update channel
      $channel->Updated = Carbon::now();
      $channel->save();

      return response($chat, 200);
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
