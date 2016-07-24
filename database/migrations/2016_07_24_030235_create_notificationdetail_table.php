<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotificationdetailTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('NotificationDetail')) {
        Schema::create('NotificationDetail', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('NotificationID');
          $table->text('Data')->nullable();
          $table->string('KeyString', 50)->nullable();
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
      Schema::dropIfExists('NotificationDetail');
    }
}
