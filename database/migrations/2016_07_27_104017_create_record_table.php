<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRecordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('records')) {
        Schema::create('records', function (Blueprint $table)
        {
          $table->bigIncrements('id');
          $table->timestamp('created_at');
          $table->decimal('time', 6, 4)->nullable();
          $table->text('uri', 50)->nullable();
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
      Schema::dropIfExists('records');
    }
}
