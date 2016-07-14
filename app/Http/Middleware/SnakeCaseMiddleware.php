<?php

namespace App\Http\Middleware;

use Closure;

class SnakeCaseMiddleware
{
    protected static $camelToSnake = [
      'ID' => 'id',
      'TeamID' => 'team_id',
      'Name' => 'name',
      'DisplayName' => 'display_name',
      'ProjectID' => 'project_id',
      'UserID' => 'user_id',
      'Thumbnail' => 'thumbnail',

      'RootID' => 'root_id',
      'ParentID' => 'parent_id',
      'SourceStageID' => 'source_stage_id',
      'PublishedStageID' => 'published_stage_id',
      'ReservedID' => 'reserved_id',
      'Token' => 'token',
      'State' => 'state',
      'Written' => 'is_written',

      'Mode' => 'mode',
      'ScriptID' => 'script_id',
      'Title' => 'title',
      'SourceID' => 'source_id',
      'Playcount' => 'playcount',
      'NoRestage' => 'no_restage',
      'RejectNotice' => 'reject_notice',
      'Published' => 'published_at',
      'Explain' => 'explain',
      'ImplicitMod' => 'implicit_mod',
      'MajorVersion' => 'major_version',
      'MinorVersion' => 'minor_version',

      'LineNum' => 'line_num',
      'RawCode' => 'raw_code',
      'Processed' => 'is_processed',

      'Gender' => 'gender',
      'Nickname' => 'nickname',
      'AcceptLanguage' => 'accept_language',
      'ProfileImageURL' => 'profile_image_url',
      'IsSupported' => 'is_supported',
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

      if($response->headers->get('content-type') == 'application/json' &&
        method_exists($response, 'getOriginalContent'))
      {
        $original = $response->getOriginalContent();
        $collection = is_array($original) ? $original : $original->toArray();

        $collection = self::camelToSnakeRecursive($collection);

        $response->setContent($collection);
      }

      return $response;
    }

    public static function camelToSnakeRecursive(Array $array)
    {
      return self::appendRecursive($array, self::$camelToSnake);
    }

    public static function snakeToCamelRecursive(Array $array)
    {
      return self::appendRecursive($array, array_flip(self::$camelToSnake));
    }

    protected static function appendRecursive(Array $array, $pattern)
    {
      $copied = [];

      // Just add. (NOT remove camelcase keys)
      foreach ($array as $key => $value) {
        if (is_array($value)) {
          $copied[$key] = self::appendRecursive($value, $pattern);
        }
        elseif (is_object($value)) {
          $copied[$key] = self::appendRecursive($value->toArray(), $pattern);
        }
        elseif (array_key_exists($key, $pattern)) {
          $appendKey = $pattern[$key];
          $copied[$appendKey] = $copied[$key] = $array[$key]; // copy and append
        }
        else {
          $copied[$key] = $array[$key]; // just copy
        }
      }

      return $copied;
    }

}
