<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePavilionTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Pavilion')) {
        Schema::create('Pavilion', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('DisplayName')->nullable();
          $table->bigInteger('KitStageID')->unsigned()->nullable();
          $table->integer('RequiredAchievements')->default(0);
          $table->integer('LocationNumber')->nullable();

          // $table->foreign('KitStageID')->references('ID')->on('Stage')->onDelete('cascade');
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
      Schema::drop('Pavilion');
    }
}
