<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddStageFlags extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (Schema::hasTable('stage')) {
        Schema::table('stage', function (Blueprint $table)
        {
          $table->boolean('is_clearable')->default(false);
          $table->boolean('is_latest')->default(false);
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
      if (Schema::hasTable('stage')) {
        Schema::table('stage', function (Blueprint $table)
        {
          $table->dropColumn(['is_clearable', 'is_latest']);
        });
      }
    }
}
