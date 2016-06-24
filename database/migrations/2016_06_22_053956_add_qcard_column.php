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
        if (!Schema::hasColumn('bell', 'qcard_id')) {
          $table->bigInteger('qcard_id')->unsigned()->nullable();
          $table->foreign('qcard_id')->references('id')->on('qcard');
        }
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
