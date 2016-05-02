<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRejectReasonDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('RejectReasonData')) {
        Schema::create('RejectReasonData', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('Message', 100);
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
      Schema::drop('RejectReasonData');
    }
}
