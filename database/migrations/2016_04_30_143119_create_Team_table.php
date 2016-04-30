<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTeamTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Team')) {
        Schema::create('Team', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('Name', 100)->nullable();
          $table->string('DisplayName', 100)->nullable();
          $table->datetime('Registered')->nullable();
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
      Schema::drop('Team');
    }
}
