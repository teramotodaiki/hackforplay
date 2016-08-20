<?php

use Illuminate\Database\Seeder;

use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\ServiceException;

use App\Stage;


class BlobThumbnailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      $blobRestProxy = ServicesBuilder::getInstance()->createBlobService(env('BLOB_CONNECTION', ''));

      try {
        Stage::where('Thumbnail', 'like', '/%')
        ->chunk(100, function ($stages) use ($blobRestProxy)
        {
          $old_base_path = base_path('resources/views/vendor/hackforplay');
          $new_base_path = env('BLOB_URL') . '/' . env('BLOB_CONTAINER');

          foreach ($stages as $stage) {
            $content = fopen($old_base_path . $stage->Thumbnail, "r");
            if ($content === FALSE) continue;
            $blob_name = str_random(32) . '.png';

            //Upload blob
            $blobRestProxy->createBlockBlob(env('BLOB_CONTAINER'), $blob_name, $content);

            $stage->update(['Thumbnail' => $new_base_path . '/' . $blob_name]);
            fclose($content);
          }
        });
      }
      catch(ServiceException $e){
        // Handle exception based on error codes and messages.
        // Error codes and messages are here:
        // http://msdn.microsoft.com/library/azure/dd179439.aspx
        $code = $e->getCode();
        $error_message = $e->getMessage();
        echo $code.": ".$error_message. " count:". $count . "<br />";
      }
    }
}
