<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChatsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('chats')) {
        Schema::create('chats', function (Blueprint $table)
        {
          $table->bigIncrements('id');

          $table->bigInteger('channel_id')->unsigned();
          $table->foreign('channel_id')->references('ID')->on('Channel')->onDelete('cascade');

          $table->bigInteger('user_id')->unsigned()->nullable();
          $table->foreign('user_id')->references('ID')->on('User')->onDelete('cascade');

          $table->text('message')->nullable();

          $table->timestamps();
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
      Schema::drop('chats');
    }
}
