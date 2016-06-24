<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddQcardColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('bell', function (Blueprint $table)
      {
        $table->bigInteger('qcard_id')->unsigned()->nullable();
        $table->foreign('qcard_id')->references('id');
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('bell', function (Blueprint $table)
      {
        $table->dropColumn(['qcard_id']);
      });
    }
}
