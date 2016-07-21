<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Author;

class AuthorController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $authors = $request->user()->authors;
      return response($authors, 200);
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
        'name' => ['regex:/^[a-zA-Z0-9\_][\w\_\-\~\*]+$/', 'unique:authors', 'between:2,20'],
      ]);
      $authors = $request->user()->authors;

      $is_auto = +!$request->has('name');
      $already = $authors->where('is_auto', $is_auto)->first();
      if($already) return response($already, 200);

      $random;
      if ($is_auto) {
        do {
          $random = mb_strtolower(str_random(3)) . '-' . mb_strtolower(str_random(3)); // 'xxx-xxx'
        } while (Author::where('name', $random)->count() > 0);
      }

      $new = $request->user()->authors()
      ->create([
        'name' => $is_auto ? $random : $request->input('name'),
        'is_auto' => $is_auto,
      ]);

      return response($new, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      return response(Author::findOrFail($id), 200);
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
