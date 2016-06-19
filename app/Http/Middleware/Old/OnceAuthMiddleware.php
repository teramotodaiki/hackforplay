<?php

namespace App\Http\Middleware\Old;

use Closure;
use Auth;
use App\Session;
use App\User;

class OnceAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
      // Once auth from OLD AUTH WITH SESSION from cookie
      session_start();
      $session = Session::find(session_id());
      if ($session) {
        session_decode($session->Data);
      }
      session_commit();

      if (isset($_SESSION['UserID'])) {
        Auth::loginUsingId($_SESSION['UserID'], false);
      }

      return $next($request);
    }
}
