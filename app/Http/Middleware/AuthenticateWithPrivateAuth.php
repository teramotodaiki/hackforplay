<?php

namespace App\Http\Middleware;

use App\User;
use Closure;

class AuthenticateWithPrivateAuth
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
      $user = User::where($request->only(['private_token', 'private_secret']))->first();
      if (!$user) {
        return response('Unauthorized', 401);
      }
      return $next($request);
    }
}
