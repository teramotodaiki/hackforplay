<?php

namespace App\Http\Middleware;

use Closure;
use Pusher;

class PusherMiddleware
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
      $request->test = 'text';
      $request->pusher = new Pusher(
        env('PUSHER_KEY'),
        env('PUSHER_SECRET'),
        env('PUSHER_APP_ID'),
        [
          'encrypted' => false
        ]
      );

      return $next($request);
    }
}
