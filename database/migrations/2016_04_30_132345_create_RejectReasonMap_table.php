<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRejectReasonMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('RejectReasonMap')) {
        Schema::create('RejectReasonMap', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('StageID')->unsigned();
          $table->bigInteger('DataID')->unsigned();
          $table->datetime('Registered');

          // $table->foreign('StageID')->references('ID')->on('Stage')->onDelete('cascade');
          // $table->foreign('DataID')->references('ID')->on('RejectReasonData')->onDelete('cascade');
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
      Schema::drop('RejectReasonMap');
    }
}
