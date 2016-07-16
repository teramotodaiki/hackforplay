<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateEmojiTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('emojis')) {
        Schema::create('emojis', function (Blueprint $table)
        {
          $table->bigIncrements('id');
          $table->bigInteger('stage_id')->unsigned();
          $table->foreign('stage_id')->references('id')->on('stage');
          $table->bigInteger('user_id')->unsigned();
          $table->foreign('user_id')->references('id')->on('user');
          $table->string('shortname', 50);
          $table->timestamp('created_at');
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
      Schema::dropIfExists('emojis');
    }
}
