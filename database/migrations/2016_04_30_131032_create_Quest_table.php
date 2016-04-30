<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Quest')) {
        Schema::create('Quest', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('PavilionID')->unsigned()->nullable();
          $table->string('Type', 10)->default('easy')->nullable();
          $table->boolean('Published');

          // $table->foreign('PavilionID')->references('ID')->on('Pavilion')->onDelete('cascade');
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
      Schema::drop('Quest');
    }
}
