<?php

use Illuminate\Database\Seeder;
use App\Play;
use Carbon\Carbon;

class PlaysTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
      DB::table('plays')->truncate();

      DB::table('PlayLog')->chunk(100, function ($play_logs)
      {
        foreach ($play_logs as $old) {
          $play = new Play;
          $play->user_id = $old->UserID;
          $play->stage_id = $old->StageID;
          $play->referrer = $old->Referrer;
          $play->token = $old->Token;
          $play->is_cleared = $old->Cleared !== null;
          $play->created_at = Carbon::parse($old->Registered);
          $play->updated_at = $old->Cleared !== null ?
          Carbon::parse($old->Cleared) : $play->created_at;

          $play->save();
        }
      });
    }
}
