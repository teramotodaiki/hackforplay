/*
 * rmap.js (RelationalMap)
 * ある位置で他のマップとつながっている、切り替え可能なマップ
 */
var RelationalMap = function(tileWidth, tileHeight) {
	if (tileWidth === undefined) {tileWidth = 32;}
	if (tileHeight === undefined) {tileHeight = 32;}
	this.bmap = new Map(tileWidth, tileHeight); // 他のオブジェクトより奥に表示されるマップ
	this.fmap = new Map(tileWidth, tileHeight); // 他のオブジェクトより手前に表示されるマップ
	this.scene = new Group();					// マップ上に存在するオブジェクトをまとめるグループ
	// cmap=this.bmap.collisionData
	this.__defineSetter__('cmap', function(c){ this.bmap.collisionData = c; });
	this.__defineGetter__('cmap', function(){ return this.bmap.collisionData; });
	// image=this.bmap.image=this.fmap.image
	this.__defineSetter__('image', function(i){ this.bmap.image = this.fmap.image = i; });
	this.__defineGetter__('width', function(){ return this.bmap.width; }); // this.bmap.widthのシノニム
	this.__defineGetter__('height', function(){ return this.bmap.height; }); // this.bmap.heightのシノニム
	this.rels = []; // from, name, toで記述
	this.callback = function(){};
	this.checkTile = function(x, y, z){};
	this.hitTest = function(x, y){ return this.bmap.hitTest(x, y) || this.fmap.hitTest(x, y); };
	this.getRel = function(x, y){ var t; this.rels.forEach(function(r){ if((x==r.from.x)&&(y==r.from.y)){ t=r; } }); return t; };
	this.load = function(){ var a = function(n){ game.rootScene.addChild(n); };
					a(this.bmap); a(this.scene); a(this.fmap); env.map = this; };
};
function changeMap(rel){
	var next = maps[rel.name];
	if(next !== env.map){
		var f = function(n, m){ game.rootScene.insertBefore(n, m); game.rootScene.removeChild(m); };
		f(next.bmap, env.map.bmap);
		f(next.scene, env.map.scene);
		f(next.fmap, env.map.fmap);

		next.scene.addChild(env.player);
		env.map = next;
	}
	env.player.locate(rel.to.x, rel.to.y);
	next.callback();
}