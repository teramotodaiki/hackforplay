<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddChannelTableColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      Schema::table('channel', function (Blueprint $table)
      {
        $table->boolean('is_private')->default(FALSE);
        $table->boolean('is_archived')->default(FALSE);
        $table->timestamps();
        $table->string('description', 100)->nullable();
      });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
      Schema::table('channel', function (Blueprint $table)
      {
        $table->dropColumn(['is_private', 'is_closed', 'created_at', 'updated_at', 'description']);
      });
    }
}
