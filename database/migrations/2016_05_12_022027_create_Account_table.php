<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAccountTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Account')) {
        Schema::create('Account', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('UserID')->unsigned();
          $table->string('Type', 10);
          $table->string('State', 10);
          $table->string('Email', 100);
          $table->string('Hashed', 100);
          $table->bigInteger('ExternalID')->nullable();
          $table->datetime('Registered');

          $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
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
      Schema::drop('Account');
    }
}
