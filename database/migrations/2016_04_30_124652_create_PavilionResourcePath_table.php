<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreatePavilionResourcePathTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('PavilionResourcePath')) {
        Schema::create('PavilionResourcePath', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('BodyBg', 50)->nullable();
          $table->string('EasyBg', 50)->nullable();
          $table->string('NormalBg', 50)->nullable();
          $table->string('HardBg', 50)->nullable();
          $table->string('KitBg', 50)->nullable();
          $table->string('ModalClose', 50)->nullable();
          $table->string('ModalArrow', 50)->nullable();
          $table->string('StageFrame', 50)->nullable();
          $table->string('Icon', 50)->nullable();
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
      Schema::drop('PavilionResourcePath');
    }
}
