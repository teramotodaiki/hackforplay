<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateScriptTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('Script')) {
        Schema::create('Script', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('ProjectID')->unsigned()->nullable();
          $table->integer('LineNum')->nullable();
          $table->string('Thumbnail')->nullable();
          $table->text('RawCode')->nullable();
          $table->datetime('Registered')->nullable();
          $table->datetime('Updated')->nullable();
          $table->boolean('Processed')->default(0);

          // $table->foreign('ProjectID')->references('ID')->on('Project')->onDelete('cascade');
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
      Schema::drop('Script');
    }
}
