<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Notification')) {
        Schema::create('Notification', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->string('State', 50)->nullable();
          $table->string('Type', 50)->nullable();
          $table->string('Thumbnail', 50)->nullable();
          $table->string('LinkedURL', 50)->nullable();
          $table->timestamp('MakeUnixTime')->nullable();
          $table->timestamp('ReadUnixTime')->nullable();

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
      Schema::drop('Notification');
    }
}
