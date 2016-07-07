<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddProjectColumn extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
      if (Schema::hasTable('project')) {
        Schema::table('project', function (Blueprint $table)
        {
          $table->string('title', 50)->nullable();
          $table->string('description', 400)->nullable();
          $table->string('gist_id', 20)->nullable();
          $table->string('thumbnail', 100)->nullable();
          $table->boolean('is_active')->default(true);
          $table->timestamps();
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
      if (Schema::hasTable('project')) {
        Schema::table('project', function (Blueprint $table)
        {
          $table->dropColumn([
            'title',
            'description',
            'gist_id',
            'thumbnail',
            'is_active',
            'created_at',
            'updated_at',
          ]);
        });
      }
    }
}
