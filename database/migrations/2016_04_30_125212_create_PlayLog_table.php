<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePlayLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('PlayLog')) {
        Schema::create('PlayLog', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('Token', 32);
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->bigInteger('StageID')->unsigned()->nullable();
          $table->string('Referrer', 100)->nullable();
          $table->datetime('Registered')->nullable();
          $table->datetime('Cleared')->nullable();

          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
          // $table->foreign('StageID')->references('ID')->on('Stage')->onDelete('cascade');
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
      Schema::drop('PlayLog');
    }
}
