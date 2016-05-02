<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateProjectTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Project')) {
        Schema::create('Project', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->bigInteger('RootID')->unsigned()->nullable();
          $table->bigInteger('ParentID')->unsigned()->nullable();
          $table->bigInteger('SourceStageID')->unsigned()->nullable();
          $table->bigInteger('PublishedStageID')->unsigned()->nullable();
          $table->bigInteger('ReservedID')->unsigned()->nullable();
          $table->string('Token', 32)->nullable();
          $table->string('State', 50)->nullable();
          $table->boolean('Written')->default(0);
          $table->datetime('Registered')->nullable();

          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
          // $table->foreign('RootID')->references('ID')->on('Project')->onDelete('cascade');
          // $table->foreign('ParentID')->references('ID')->on('Project')->onDelete('cascade');
          // $table->foreign('SourceStageID')->references('ID')->on('Stage')->onDelete('cascade');
          // $table->foreign('PublishedStageID')->references('ID')->on('Stage')->onDelete('cascade');
          // $table->foreign('ReservedID')->references('ID')->on('Stage')->onDelete('cascade');
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
      Schema::drop('Project');
    }
}
