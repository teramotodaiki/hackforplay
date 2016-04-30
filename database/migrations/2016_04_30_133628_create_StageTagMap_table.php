<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStageTagMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('StageTagMap')) {
        Schema::create('StageTagMap', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('StageID')->unsigned()->nullable();
          $table->bigInteger('TagID')->unsigned()->nullable();
          $table->bigInteger('CommentID')->unsigned()->nullable();
          $table->datetime('Registered')->nullable();

          // $table->foreign('StageID')->references('ID')->on('Stage')->onDelete('cascade');
          // $table->foreign('TagID')->references('ID')->on('StageTagData')->onDelete('cascade');
          // $table->foreign('CommentID')->references('ID')->on('CommentData')->onDelete('cascade');
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
      Schema::drop('StageTagMap');
    }
}
