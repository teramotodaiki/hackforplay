<?php

namespace App\Http\Middleware;

use Closure;

class SnakeCaseMiddleware
{

    protected $camelToSnake = [
    ];

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

      if($response->headers->get('content-type') == 'application/json')
      {
        $collection = $response->getOriginalContent()->toArray();

        // Just add. (NOT remove camelcase keys)
        foreach ($this->camelToSnake as $camelKey => $snakeKey) {
          if (array_key_exists($camelKey, $collection)) {
            $collection[$snakeKey] = $collection[$camelKey];
          }
        }

        $response->setContent($collection);
      }

      return $response;
    }
}
