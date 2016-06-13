<?php

use Illuminate\Database\Seeder;
use App\Mod;

class ModTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {

        Mod::create([ 'bundle' => 'hackforplay/hack'                ,
                      'paths' => 'modules/hack.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/rpg-kit-main'        ,
                      'paths' => 'kit/rpg_hack_project/main.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/rpg-kit-camera'      ,
                      'paths' => 'kit/rpg_hack_project/camera.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/rpg-kit-color'       ,
                      'paths' => 'kit/rpg_hack_project/color.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/rpg-kit-rpgobjects'  ,
                      'paths' => 'kit/rpg_hack_project/rpgobjects.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/rpg-kit-smartassets' ,
                      'paths' => 'kit/rpg_hack_project/smartassets.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/ap-kit-main'         ,
                      'paths' => 'kit/ap_project/main.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/commet-kit-main'     ,
                      'paths' => 'kit/music_game_project/main.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/survive-kit-main'    ,
                      'paths' => 'kit/Tsuka_Project/main.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/run-kit-main'        ,
                      'paths' => 'lib/run.js']);
                      
        Mod::create([ 'bundle' => 'hackforplay/typing-kit-main'     ,
                      'paths' => 'lib/typing.js']);
                      
        Mod::create([ 'bundle' => 'enchantjs/enchant'               ,
                      'paths' => 'modules/enchant.js']);
                      
        Mod::create([ 'bundle' => 'enchantjs/ui.enchant'            ,
                      'paths' => 'modules/ui.enchant.js']);
                      
        Mod::create([ 'bundle' => 'soundcloud/sdk-3.0.0'            ,
                      'paths' => 'modules/sdk-3.0.0.js']);
                      
    }
}
