<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Account;

class RandomController extends Controller
{
  private $call; // call method by name

  public function __construct()
  {
    $this->middleware('App\Http\Middleware\VerifyCsrfToken');

    $this->queries = ['login_id']; // white list
    $this->call = function ($key) {
      return method_exists($this, $key) ? $this->$key() : NULL;
    };
  }

  public function index(Request $request)
  {
    $keys = explode(' ', $request->input('keys', '')); // e.g. 'one two other'
    $keys = array_intersect($keys, $this->queries); // validation
    $values = array_map($this->call, $keys);

    return response(array_combine($keys, $values), 200);
  }

  public function login_id()
  {
    while (true) {
    	$random	= (string) mt_rand(10000000, 99999999); // 8 digit number

      if (Account::where('email', $random)->count() === 0) {
        return $random; // vacancy value
      }
    }
  }

}
