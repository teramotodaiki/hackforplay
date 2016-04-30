<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChannelTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Channel')) {
        Schema::create('Channel', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('CommunityID')->nullable();
          $table->string('Name', 100)->nullable();
          $table->string('DisplayName', 100)->nullable();
          $table->bigInteger('ProjectID')->nullable();
          $table->string('ProjectToken', 32)->nullable();
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->string('Thumbnail', 100)->nullable();
          $table->datetime('Registered')->nullable();
          $table->datetime('Updated')->nullable();

          // $table->foreign('CommunityID')->references('ID')->on('Community')->onDelete('cascade');
          // $table->foreign('ProjectID')->references('ID')->on('Project')->onDelete('cascade');
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
        Schema::drop('Channel');
    }
}
