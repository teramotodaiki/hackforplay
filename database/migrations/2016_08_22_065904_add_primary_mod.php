<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPrimaryMod extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (Schema::hasTable('plugs')) {
        Schema::table('plugs', function (Blueprint $table)
        {
          $table->boolean('is_primary')->default(false);
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
      if (Schema::hasTable('plugs')) {
        Schema::table('plugs', function (Blueprint $table)
        {
          $table->dropColumn(['is_primary']);
        });
      }
    }
}
