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

        $collection = $this->camelToSnakeRecursive($collection);

        $response->setContent($collection);
      }

      return $response;
    }

    protected function camelToSnakeRecursive($array)
    {
      $copied = [];

      // Just add. (NOT remove camelcase keys)
      foreach ($array as $key => $value) {
        if (is_array($value)) {
          $copied[$key] = $this->camelToSnakeRecursive($value);
        }
        elseif (is_object($value)) {
          $copied[$key] = $this->camelToSnakeRecursive($value->toArray());
        }
        elseif (array_key_exists($key, $this->camelToSnake)) {
          $snakecase = $this->camelToSnake[$key];
          $copied[$snakecase] = $copied[$key] = $array[$key]; // copy and append
        }
        else {
          $copied[$key] = $array[$key]; // just copy
        }
      }

      return $copied;
    }
}
