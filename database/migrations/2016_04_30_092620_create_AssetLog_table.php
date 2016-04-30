<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateAssetLogTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('AssetLog')) {
        Schema::create('AssetLog', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('AssetID')->nullable();
          $table->bigInteger('UserID')->nullable()->unsigned();
          $table->bigInteger('ProjectID')->nullable();
          $table->bigInteger('StageID')->nullable();
          $table->datetime('Registered')->nullable();

          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
          // $table->foreign('ProjectID')->references('ID')->on('Project')->onDelete('cascade');
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
        Schema::drop('AssetLog');
    }
}
