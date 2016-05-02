<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStageTagDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('StageTagData')) {
        Schema::create('StageTagData', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('IdentifierString', 50);
          $table->string('DisplayString', 50)->nullable();
          $table->string('LabelColor', 50)->nullable();
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
      Schema::drop('StageTagData');
    }
}
