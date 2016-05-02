<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAnonymousUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('AnonymousUser')) {
        Schema::create('AnonymousUser', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('CollatingKey', 32);
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->boolean('HelpFlag')->nullable();
          $table->datetime('Registered')->nullable();

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
      Schema::drop('AnonymousUser');
    }
}
