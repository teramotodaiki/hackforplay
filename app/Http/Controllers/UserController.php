<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\User;
use App\Account;

class UserController extends Controller
{
    public function __construct()
    {
      $this->middleware('App\Http\Middleware\VerifyCsrfToken');
    }

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
        'gender'    => 'required|string|in:male,female',
        'nickname'  => 'required|string|max:99',
        'login_id'  => 'required|string|between:3,99|unique:account,email',
        'password'  => 'required|string|between:6,99'
      ]);

      $user = new User([
        'gender' => $request->input('gender'),
        'nickname' => $request->input('nickname'),
        'acceptlanguage' => $_SERVER['HTTP_ACCEPT_LANGUAGE'],
        'registered' => gmdate('Y-m-d H:i:s')
      ]);
      $user->save();

      $account = new Account([
        'type' => 'paperlogin',
        'state' => 'connected',
        'email' => $request->input('login_id'),
        'hashed' => password_hash($request->input('password'), PASSWORD_DEFAULT),
        'registered' => gmdate('Y-m-d H:i:s')
      ]);

      $user->accounts()->save($account);

      return "{}";
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
      $user = User::findOrFail($id);
      return response($user, 200);
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

    public function getAuth(Request $request)
    {
      return response($request->user(), 200);
    }
}
