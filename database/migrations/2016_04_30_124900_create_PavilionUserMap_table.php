<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePavilionUserMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('PavilionUserMap')) {
        Schema::create('PavilionUserMap', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('PavilionID')->unsigned()->nullable();
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->boolean('Restaged')->default(0);
          $table->boolean('Certified')->default(0);

          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
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
      Schema::drop('PavilionUserMap');
    }
}
