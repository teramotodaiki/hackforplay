<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLevelUserMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('LevelUserMap')) {
        Schema::create('LevelUserMap', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('LevelID')->unsigned();
          $table->bigInteger('UserID')->unsigned();
          $table->boolean('Cleared')->default(0);

          // $table->foreign('LevelID')->references('ID')->on('Level')->onDelete('cascade');
          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
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
      Schema::drop('LevelUserMap');
    }
}
