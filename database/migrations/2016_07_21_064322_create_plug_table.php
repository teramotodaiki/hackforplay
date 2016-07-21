<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlugTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('plugs')) {
        Schema::create('plugs', function (Blueprint $table)
        {
          $table->bigIncrements('id');

          $table->bigInteger('author_id')->unsigned()->nullable();
          $table->foreign('author_id')->references('id')->on('author');
          $table->bigInteger('stage_id')->unsigned();
          $table->foreign('stage_id')->references('id')->on('stage');

          $table->string('label', 20);
          $table->boolean('is_visible')->default(true);
          $table->boolean('is_used')->default(false);
          $table->timestamps();
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
      Schema::dropIfExists('plugs');
    }
}
