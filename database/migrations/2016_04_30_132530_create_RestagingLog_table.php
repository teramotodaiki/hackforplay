<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateRestagingLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('RestagingLog')) {
        Schema::create('RestagingLog', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->string('Token', 32);
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->bigInteger('StageID')->unsigned()->nullable();
          $table->string('Mode', 10)->nullable();
          $table->timestamp('BeginUnixTime')->nullable();
          $table->timestamp('LastUnixTime')->nullable();
          $table->integer('ExecuteCount')->default(0);
          $table->integer('SaveCount')->default(0);
          $table->integer('InputNumberCount')->default(0);
          $table->integer('InputAlphabetCount')->default(0);
          $table->integer('InputOtherCount')->default(0);
          $table->integer('PasteCount')->default(0);
          $table->integer('DeleteCount')->default(0);

          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
          // $table->foreign('StageID')->references('ID')->on('Stage')->onDelete('cascade');
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
      Schema::drop('RestagingLog');
    }
}
