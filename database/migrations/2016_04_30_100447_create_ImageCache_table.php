<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImageCacheTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('ImageCache')) {
        Schema::create('ImageCache', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('Origin', 1000)->nullable();
          $table->integer('Width')->nullable();
          $table->integer('Height')->nullable();
          $table->string('Filename', 1000)->nullable();
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
      Schema::drop('ImageCache');
    }
}
