<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLevelTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Level')) {
        Schema::create('Level', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('StageID')->unsigned()->nullable();
          $table->bigInteger('QuestID')->unsigned()->nullable();
          $table->bigInteger('PlayOrder')->nullable();

          // $table->foreign('StageID')->references('ID')->on('Stage')->onDelete('cascade');
          // $table->foreign('QuestID')->references('ID')->on('Quest')->onDelete('cascade');
        });
      }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::drop('Level');
    }
}
