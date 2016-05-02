<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttendanceTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Attendance')) {
        Schema::create('Attendance', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('UserID')->nullable()->unsigned();
          $table->string('Token', 32)->nullable();
          $table->datetime('Begin')->nullable();
          $table->datetime('End')->nullable();

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
        Schema::drop('Attendance');
    }
}
