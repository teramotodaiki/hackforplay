<?php

namespace App\Http\Middleware;

use Closure;
use App\Record;
use Carbon\Carbon;

class RecordTimeMiddleware
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
      $response = $next($request);

      if (env('APP_RECORD', false)) {
        Record::create([
          'created_at' => Carbon::now()->toDateTimeString(),
          'time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
          'uri' => $_SERVER['REQUEST_URI'],
        ]);
      }

      return $response;
    }
}
