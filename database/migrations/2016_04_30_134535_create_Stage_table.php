<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateStageTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Stage')) {
        Schema::create('Stage', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('UserID')->unsigned()->nullable();
          $table->bigInteger('TeamID')->unsigned()->nullable();
          $table->string('Mode', 10)->nullable();
          $table->bigInteger('ScriptID')->unsigned()->nullable();
          $table->bigInteger('ProjectID')->unsigned()->nullable();
          $table->string('Title', 100)->nullable();
          $table->string('State', 10)->nullable();
          $table->string('Thumbnail', 1000)->nullable();
          $table->bigInteger('SourceID')->unsigned()->nullable();
          $table->bigInteger('Playcount')->default(0);
          $table->string('Src', 100)->default('');
          $table->boolean('NoRestage')->default(0);
          $table->string('RejectNotice', 1000)->nullable();
          $table->datetime('Registered')->nullable();
          $table->datetime('Published')->nullable();
          $table->string('Explain', 1000)->nullable();

          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
          // $table->foreign('TeamID')->references('ID')->on('Team')->onDelete('cascade');
          // $table->foreign('ScriptID')->references('ID')->on('Script')->onDelete('cascade');
          // $table->foreign('ProjectID')->references('ID')->on('Project')->onDelete('cascade');
          // $table->foreign('SourceID')->references('ID')->on('Stage')->onDelete('cascade');
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
      Schema::drop('Stage');
    }
}
