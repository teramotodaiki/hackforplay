<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnonymousUserDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('AnonymousUserData')) {
        Schema::create('AnonymousUserData', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('AUserID');
          $table->bigInteger('StageID')->nullable();
          $table->integer('ClearTime')->nullable();
          $table->boolean('UseHint')->nullable();
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
      Schema::drop('AnonymousUserData');
    }
}
