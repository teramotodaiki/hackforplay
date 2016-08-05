<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class PlaysSoftDelete extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (Schema::hasTable('plays')) {
        Schema::table('plays', function (Blueprint $table)
        {
          $table->softDeletes();
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
      if (Schema::hasTable('plays')) {
        Schema::table('plays', function (Blueprint $table)
        {
          $table->dropColumn('deleted_at');
        });
      }
    }
}
