<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddTeamTableColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('team', function (Blueprint $table)
      {
        $table->text('bell_notice')->nullable();
        $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('team', function (Blueprint $table)
      {
        $table->dropColumn(['bell_notice', 'created_at', 'updated_at']);
      });
    }
}
