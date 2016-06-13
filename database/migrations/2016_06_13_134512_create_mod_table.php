<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateModTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('mod')) {
        Schema::create('mod', function (Blueprint $table)
        {
          $table->bigIncrements('id');

          $table->string('bundle', 50)->unique();
          $table->text('paths');

          $table->timestamps();
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
      Schema::drop('mod');
    }
}
