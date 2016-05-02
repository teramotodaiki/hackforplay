<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCommentDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('CommentData')) {
        Schema::create('CommentData', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('StageID')->unsigned();
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->string('State', 50);
          $table->string('Message', 1000)->nullable();
          $table->string('Thumbnail', 100)->nullable();
          $table->datetime('Registered');

          // $table->foreign('StageID')->references('ID')->on('Stage')->onDelete('cascade');
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
      Schema::drop('CommentData');
    }
}
