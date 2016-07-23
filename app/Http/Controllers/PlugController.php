<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Plug;
use App\Author;
use App\Stage;

class PlugController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $plugs = $request->user()->plugs();

      if ($request->has('author')) {
        $plugs->where('author_id', $request->input('author'));
      }
      if ($request->has('stage')) {
        $plugs->where('stage_id', $request->input('stage'));
      }

      return response($plugs->paginate(), 200);
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
        'stage' => 'required|numeric',
        'author' => 'required|numeric',
        'label' => ['required', 'regex:/^[a-zA-Z0-9\_][\w\_\-\~\*]+$/', 'between:2,20'],
      ]);

      $user_id = $request->user()->ID;
      $stage = Stage::findOrFail($request->input('stage'));
      $author = Author::findOrFail($request->input('author'));

      if ($stage->UserID != $user_id) {
        return response([ 'message' => 'stage_not_yours' ], 200);
      }
      if ($author->user_id != $user_id) {
        return response([ 'message' => 'author_not_yours' ], 200);
      }

      $already = Plug::where([
        'label' => $request->input('label'),
        'author_id' => $request->input('author'),
      ])->first();
      if ($already) return response($already, 200);

      $plug = $author->plugs()->create([
        'stage_id' => $stage->ID,
        'label' => $request->input('label'),
      ]);

      return response($plug, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      return response(Plug::findOrFail($id), 200);
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
      $plug = Plug::findOrFail($id);

      $user_id = $request->user()->ID;
      if ($plug->author->user_id != $user_id) {
        return response([ 'message' => 'cant_update_plug' ], 200);
      }

      if ($request->has('stage')) {
        $stage = Stage::findOrFail($request->input('stage'));
        if ($stage->UserID != $user_id) {
          return response([ 'message' => 'stage_not_yours' ], 200);
        }

        if ($plug->stage_id != $request->input('stage')) {
          $plug->stage_id = $request->input('stage');
          $plug->is_used = 0;
        }
      }

      if ($request->has('is_visible')) {
        $plug->is_visible = +$request->input('is_visible');
      }

      $plug->save();
      return response($plug, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, $id)
    {
      $plug = Plug::findOrFail($id);

      $user_id = $request->user()->ID;
      if ($plug->author->user_id != $user_id) {
        return response([ 'message' => 'cant_delete_plug' ], 200);
      }

      $plug->delete();
      return response([], 200);
    }
}
