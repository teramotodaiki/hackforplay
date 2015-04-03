/*
 * mapdata.js
 * マップデータをつくる
*/
function loadMap(){

    game.addEventListener('load', function(){
        maps['Living'].image = game.assets['img/map_lizzy.png'];
    });

    maps['Living'] = new RelationalMap(32, 32);
    maps['Living'].bmap.loadData([
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    ],[
        [ 22, 20, 20, 20, 22, 20, 20, 20, 20, 20, 22, 20, 20, 20, 22],
        [ 30, 28, 28, 28, 30, 28, 28, 28, 28, 28, 30, 28, 28, 28, 30],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, 88, 89, 90, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, 96, 97, 98, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1,104,105,106, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ]);
	maps['Living'].cmap = [
        [  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1,  1,  1],
        [  1,  1,  1,  1,  1,  1,  1,  0,  1,  1,  1,  1,  1,  1,  1],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
    ];
}