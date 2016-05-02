<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateUserTeamMapTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (!Schema::hasTable('UserTeamMap')) {
        Schema::create('UserTeamMap', function (Blueprint $table)
        {
          $table->bigIncrements('ID');
          $table->bigInteger('UserID')->unsigned();
          $table->bigInteger('TeamID')->unsigned();
          $table->boolean('Enabled')->nullable()->default(1);
          $table->boolean('MembershipEmpowered')->nullable();
          $table->boolean('MembershipManagement')->nullable();
          $table->boolean('DashboardEmpowered')->nullable();
          $table->boolean('DashboardManagement')->nullable();
          $table->boolean('CastingEmpowered')->nullable();
          $table->boolean('CastingManagement')->nullable();
          $table->boolean('PublishingEmpowered')->nullable();
          $table->boolean('PublishingManagement')->nullable();
          $table->datetime('Registered')->nullable();
          $table->datetime('Updated')->nullable();

          // $table->foreign('UserID')->references('ID')->on('User')->onDelete('cascade');
          // $table->foreign('TeamID')->references('ID')->on('Team')->onDelete('cascade');
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
      Schema::drop('UserTeamMap');
    }
}
