<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Channel;
use App\Qcard;
use DB;

class QcardController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $this->validate($request, [
        'channel' => 'numeric',
        'is_active' => 'boolean',
      ]);
      $table = DB::table('qcard');
      if ($request->has('channel')) {
        $table = $table->where('channel_id', $request->input('channel'));
      }
      if ($request->has('is_active')) {
        $table = $table->where('is_active', $request->input('is_active'));
      }
      return response($table->get(), 200);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function createWithChannel(Request $request, $channelId)
    {
      $channel = Channel::findOrFail($channelId);
      $user = $request->user();

      if ($channel->UserID != $user->ID) {
        return response([
          'message' => 'cant_create_qcard',
        ], 403);
      }

      $qcard = $channel->qcards()->create([]);
      $qcard->user_id = $user->ID;
      $qcard->save();

      return redirect("qcards/{$qcard->id}/edit");
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
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, $id)
    {
      $qcard = Qcard::findOrFail($id);

      if ($qcard->article) {
        $qcard->article = json_decode($qcard->article);
      }

      return response($qcard, 200);
    }

    public function view(Request $request, $id)
    {
      $qcard = Qcard::findOrFail($id);

      if ($qcard->article) {
        $qcard->article = json_decode($qcard->article);
      }

      return view('json', ['value' => $qcard]);
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
      $qcard = Qcard::findOrFail($id);
      $user = $request->user();

      if ($qcard->user_id != $user->ID) {
        return response([
          'message' => 'cant_update_qcard',
        ], 403);
      }

      $qcard->update($request->except('article'));
      if ($request->has('article')) {
        $qcard->article = json_encode($request->input('article'));
        $qcard->save();
      }
      $qcard->article = $request->input('article');
      return response($qcard, 200);
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
