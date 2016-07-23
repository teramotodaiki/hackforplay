<?php

use Illuminate\Database\Seeder;

class RareAuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

      DB::table('authors')->insert(array_map(function ($name)
      {
        return ['name' => $name];
      }, [
        'microsoft',
        'google',
        'apple',
        'amazon',
        'github',
        'facebook',
        'twitter',
        'nintendo',
        'minecraft',
      ]));
    }
}
