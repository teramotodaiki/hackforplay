<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateSessionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Sessions')) {
        Schema::create('Sessions', function (Blueprint $table)
        {
          $table->string('ID', 100);
          $table->text('Data');
          $table->timestamp('Timestamp');

          $table->primary('ID');
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
      Schema::drop('Sessions');
    }
}
