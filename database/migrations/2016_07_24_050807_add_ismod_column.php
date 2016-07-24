<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIsmodColumn extends Migration
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
          $table->boolean('is_mod')->default(false);
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
      Schema::table('stage', function ($table) {
        $table->dropColumn('is_mod');
      });
    }
}
