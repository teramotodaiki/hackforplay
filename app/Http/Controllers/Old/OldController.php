<?php
namespace App\Http\Controllers\Old;

use App\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Response;

class OldController extends Controller
{

    /**
     * Initialize
     */
    public function __construct()
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

    /**
     * somethings/index.php
     *
     * @param   $api (ex: s )
     * @return  View
     */
    public function index($api)
    {
      // Trail slash (/someApi?id=1 のようなURLを /someApi/?id=1 と変換する)
      if (array_key_exists('REQUEST_URI', $_SERVER)) {
        $path = explode('?', $_SERVER['REQUEST_URI'])[0];
        if (strlen($path) > 0 && substr($path, -1) !== '/') {
          $q = array_key_exists('QUERY_STRING', $_SERVER) && strlen($_SERVER['QUERY_STRING']) > 0 ? '?' . $_SERVER['QUERY_STRING'] : '';
          header('HTTP/1.1 301 Moved Permanently');
          header("Location: /$api/$q");
          exit();
        }
      }

      if (view()->exists("vendor.hackforplay.$api.index")) {
        // PHP
        chdir("{$this->root}{$api}");
        return view("vendor.hackforplay.$api.index", ['dbh' => $this->dbh ]);

      } else if (file_exists("{$this->root}{$api}/index.html")) {
        // html
        $content = file_get_contents("{$this->root}{$api}/index.html");
        return response($content, 200)
                ->header('Content-Type', 'text/html');
      }
    }

    /**
     * somethings.php
     *
     * @param   $dir (ex: attendance )
     * @param   $file (ex: begin )
     * @return  View
     */
    public function rawphp($dir, $file)
    {
      chdir("{$this->root}{$dir}");
      return view("vendor.hackforplay.$dir.$file", ['dbh' => $this->dbh ]);
    }

    public function rawphproot($file)
    {
      return $this->rawphp('', $file);
    }

    /**
     * somethings.extention
     *
     * @param   $api $ext
     * @return  Raw content with Content-Type
     */
    public function statics($api, $ext)
    {
      $path = "{$this->root}{$api}.{$ext}";
      if (!file_exists($path)) {
        return response('', 404);
      }

      $content = file_get_contents($path);
      $type = [
        'txt' => 'text/plain',
        'htm' => 'text/html',
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'xml' => 'application/xml',
        // images
        'png' => 'image/png',
        'jpeg' => 'image/jpeg',
        'jpg' => 'image/jpeg',
        'gif' => 'image/gif',
        'ico' => 'image/vnd.microsoft.icon',
        // audio/video
        'mp3' => 'audio/mpeg',
        'wav' => 'audio/wav',
      ][$ext];
      return response($content, 200)
              ->header('Content-Type', $type)
              ->header('Cache-Control', 'max-age=86400');
    }
}

?>
