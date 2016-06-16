<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddPrivateTokenColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('user', function ($table) {
        $table->string('private_token', 100)->nullable();
        $table->string('private_secret', 100)->nullable();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('user', function ($table) {
        $table->dropColumn(['private_token', 'private_secret']);
      });
    }
}
