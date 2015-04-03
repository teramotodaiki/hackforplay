/*
 * mapdata.js
 * マップデータをつくる
*/
function loadMap(){

    game.addEventListener('load', function(){
        maps['Floor'].image = game.assets['img/map1.gif'];
        maps['Tutorial5'].image = game.assets['img/map1.gif'];
    });

    maps['Floor'] = new RelationalMap(32, 32);
    maps['Floor'].bmap.loadData([
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342],
        [342,342,342,342,342,342,342,342,342,342,342,342,342,342,342]
    ],[
        [321,321,321,341,341,341, -1, -1, -1,341,341, -1, -1,321,321],
        [321,321,321, -1, -1, -1, -1,402, -1, -1, -1, -1, -1,321,321],
        [321,321,321, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,321,321],
        [341,341,341, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,341,341],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,402],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [321,321,321, -1, -1, -1,321,341,321, -1, -1, -1, -1,321,321],
        [321,321,321, -1, -1, -1,321,402,321, -1, -1, -1, -1,321,321],
        [341,341,341,341,341,341,341,341,341,341,341, -1, -1,341,341]
    ]);
    maps['Floor'].cmap = [
        [  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  0,  0,  1,  1],
        [  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1],
        [  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1],
        [  1,  1,  1,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  1,  1],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  1,  1,  1,  0,  0,  0,  1,  1,  1,  0,  0,  0,  0,  1,  1],
        [  1,  1,  1,  0,  0,  0,  1,  0,  1,  0,  0,  0,  0,  1,  1],
        [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0,  0,  1,  1]
    ];

    maps['Floor'].rels.push({
        from : { x:7, y:8 },
        name : 'Tutorial5',
        to : { x:7, y:1 }
    });

    maps['Tutorial5'] = new RelationalMap(32, 32);
    maps['Tutorial5'].bmap.loadData([
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45],
        [45,45,45,45,45,45,45,45,45,45,45,45,45,45,45]
    ],[
        [320,320,320,320,320,320, -1,422, -1,320,320,320,320,320,320],
        [340,340,340,340,340,340, -1, -1, -1,340,340,340,340,340,340],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [ -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [340,340,340,340,340,340,340,340,340,340,340,340,340,340,340]
    ]);
    maps['Tutorial5'].cmap = [
        [  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],
        [  1,  1,  1,  1,  1,  1,  0,  0,  0,  1,  1,  1,  1,  1,  1],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0],
        [  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1]
    ];
    maps['Tutorial5'].rels.push({
        from : { x:7, y:0 },
        name : 'Floor',
        to : { x:7, y:6 }
    });
}