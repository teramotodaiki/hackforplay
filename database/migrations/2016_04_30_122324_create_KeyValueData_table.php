<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateKeyValueDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('KeyValueData')) {
        Schema::create('KeyValueData', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('KeyString', 20);
          $table->string('ValueString', 100);
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
      Schema::drop('KeyValueData');
    }
}
