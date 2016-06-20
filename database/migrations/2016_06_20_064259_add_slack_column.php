<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSlackColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('team', function ($table)
      {
        $table->string('slack_api_token', 50)->nullable();
        $table->string('slack_channel_name', 20)->nullable();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('team', function ($table)
      {
        $table->dropColumn(['slack_api_token', 'slack_channel_name']);
      });
    }
}
