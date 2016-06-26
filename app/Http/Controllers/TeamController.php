<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Team;
use App\User;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $teams = $this->query($request->all());
      return response($teams, 200);
    }

    public function indexWithUser(Request $request, $user)
    {
      $query = (object) array_merge($request->all(), [
        'user' => User::findOrFail($user),
      ]);

      $teams = $this->query($query);
      return response($teams, 200);
    }

    public function indexWithAuthUser(Request $request)
    {
      $query = (object) array_merge($request->all(), [
        'user' => $request->user()
      ]);

      $teams = $this->query($query);
      return response($teams, 200);
    }

    public function query($query)
    {
      $teams = isset($query->user) ? $query->user->teams() : Team::skip(0);
      $teams->orderBy('updated_at', 'desc');

      return $teams->paginate();
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
      $team = Team::where(
        ctype_digit((string)$id) ? 'id' : 'name',
        $id
      )->firstOrFail();

      $user = $request->user();
      if (!$user || !$user->isConnected($team)) {
        return response([
          'messsage' => 'cant_update_team'
        ], 401);
      }

      $team->update(
        $request->all()
      );

      return response($team, 200);
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
