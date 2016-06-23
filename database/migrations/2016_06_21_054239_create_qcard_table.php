<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQcardTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('qcard')) {
        Schema::create('qcard', function (Blueprint $table)
        {
          $table->bigIncrements('id');
          $table->bigInteger('user_id')->unsigned()->nullable();
          $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
          $table->bigInteger('channel_id')->unsigned()->nullable();
          $table->foreign('channel_id')->references('id')->on('channel')->onDelete('cascade');
          $table->text('article')->nullable();
          $table->boolean('is_active')->default(TRUE);
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
      Schema::dropIfExists('qcard');
    }
}
