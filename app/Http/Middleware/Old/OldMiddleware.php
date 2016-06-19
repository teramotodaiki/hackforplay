<?php

namespace App\Http\Middleware\Old;

use Closure;
use Illuminate\Support\Facades\DB;

class OldMiddleware
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
      $request->oldConnection = new OldConnection;
      return $next($request);
    }
}

/**
 * Old hackforplay connection state
*/
class OldConnection
{
  function __construct()
  {
    // Get PDO connection
    $this->dbh = DB::connection()->getPdo();
    if (env('DB_CONNECTION') === 'mysql') {
      $this->dbh->exec("SET sql_mode='ANSI_QUOTES'");
    }
    $this->dbh->setAttribute( \PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION );

    // Document root
    $this->root = $_SERVER['DOCUMENT_ROOT'] . '/../resources/views/vendor/hackforplay/';
  }
}
