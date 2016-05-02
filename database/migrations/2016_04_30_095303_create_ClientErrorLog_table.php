<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateClientErrorLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('ClientErrorLog')) {
        Schema::create('ClientErrorLog', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->bigInteger('StageID')->unsigned()->nullable();
          $table->boolean('IsRestaging')->nullable();
          $table->string('Name', 50)->nullable();
          $table->string('Message', 1000)->nullable();
          $table->datetime('Registered')->nullable();

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
      Schema::drop('ClientErrorLog');
    }
}
