<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlaysTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('plays')) {
        Schema::create('plays', function (Blueprint $table)
        {
          $table->bigIncrements('id');

          $table->bigInteger('user_id')->unsigned()->nullable();
          $table->foreign('user_id')->references('id')->on('user')->onDelete('cascade');
          $table->bigInteger('stage_id')->unsigned()->nullable();
          $table->foreign('stage_id')->references('id')->on('stage')->onDelete('cascade');

          $table->text('referrer')->nullable();
          $table->boolean('is_cleared')->default(false);

          $table->string('token', 32)->unique()->nullable();
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
      Schema::dropIfExists('plays');
    }
}
