<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('User')) {
        Schema::create('User', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('Gender', 10)->nullable();
          $table->string('Nickname', 100)->nullable();
          $table->datetime('Birthday')->nullable();
          $table->string('TimezoneName', 50)->nullable();
          $table->integer('TimezoneOffset')->nullable();
          $table->integer('ExperienceDays')->nullable();
          $table->string('AcceptLanguage', 10)->nullable();
          $table->string('ProfileImageURL', 100)->nullable();
          $table->boolean('IsSupported')->nullable();
          $table->datetime('Registered')->nullable();
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
      Schema::drop('User');
    }
}
