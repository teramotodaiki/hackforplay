<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateQuestUserMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('QuestUserMap')) {
        Schema::create('QuestUserMap', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('QuestID')->unsigned();
          $table->bigInteger('UserID')->unsigned();
          $table->boolean('Cleared')->default(0);
          $table->boolean('Restaged')->default(0);

          // $table->foreign('QuestID')->references('ID')->on('Quest')->onDelete('cascade');
          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
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
      Schema::drop('QuestUserMap');
    }
}
