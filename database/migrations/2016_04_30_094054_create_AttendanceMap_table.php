<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAttendanceMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('AttendanceMap')) {
        Schema::create('AttendanceMap', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('AttendanceID')->unsigned();
          $table->bigInteger('KeyValueDataID')->unsigned();

          // $table->foreign('AttendanceID')->references('ID')->on('Attendance')->onDelete('cascade');
          // $table->foreign('KeyValueDataID')->references('ID')->on('KeyValueData')->onDelete('cascade');
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
      Schema::drop('AttendanceMap');
    }
}
