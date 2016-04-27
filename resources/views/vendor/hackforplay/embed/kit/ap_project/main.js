//actionpuzzlea.js
window.addEventListener('load', function() {

	var game = enchant.Core.instance;
	// New Resourses :
	game.preload(['enchantjs/x2/map2.png', 'hackforplay/dot_syuj.png', 'enchantjs/x2/icon0.png', 'enchantjs/font2.png', 'enchantjs/monster1.gif', 'dots_design/bg10_3.gif', 'dot_art_world/SC-Door-Entce03.png', 'rengoku-teien/asa_no_komorebi.mp3', 'etolier/01sougen.jpg', 'hackforplay/finger1.png', 'hackforplay/finger2.png']);

	BGM = 'rengoku-teien/asa_no_komorebi.mp3';

	input =
	{
		x: 0,
		y: 0
	};

	cam =
	{
		x: 0,
		y: 0
	}

	arrayframe = [-1,0,4,10];

	Hack.gamestate = -1;

	touchX=0,touchY=0;
	touchMode = 'Induction';// 'Induction' or 'Create'
	makeCounter = 0;

	game.onload = game.onload || function() {

		Hack.width = 32 * 15;
		Hack.height = 32 * 10;
		Hack.menuOpener.y = 54; // メニューの位置
		Hack.limitTime = 120;
		Hack.defaultParentNode = new enchant.Group(); // prepear to scroll
		if(game.assets[BGM] !== undefined){
			if(game.assets[BGM].src){
				game.assets[BGM].play();
				game.assets[BGM].src.loop = true;
			}
		}

		Hack.backgroundImage = Hack.createMovingSprite(480, 320, {
			x: 0, y: 0,
			image: game.assets['etolier/01sougen.jpg'],
			frame: [0],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});


		// Append 20150821 ====>

		(function() {

			// Lesson: 1
			var moveTL = Hack.createSprite(40, 48, {
				x: -100, y: -100,
				usedFlag: false, opacity: 0,
				image: game.assets['hackforplay/finger1.png'],
				onenterframe: function() {
					this.usedFlag = !!Hack.player.velocity.x;
					if (this.usedFlag) {
						this.parentNode.removeChild(this);
						popTL.delay(30).show().then(function() {
							this.parentNode.addChild(this);
							this.tl.clear().delay(20).then(function() {
								this.image = game.assets['hackforplay/finger2.png'];
							}).delay(20).then(function() {
								this.image = game.assets['hackforplay/finger1.png'];
							}).loop();
						});
					}
				}
			}).tl.delay(60).show().then(function() {
				this.tl.clear().then(function() {
					this.parentNode.addChild(this);
					this.moveTo(Hack.player.x, Hack.player.y);
					this.image = game.assets['hackforplay/finger1.png'];
				}).delay(20).then(function() {
					this.image = game.assets['hackforplay/finger2.png'];
				}).delay(8).moveBy(40, -60, 20, enchant.Easing.BACK_EASEINOUT).delay(20).loop();
			});

			// Lesson: 2
			var popTL = Hack.createSprite(40, 48, {
				opacity: 0,
				usedFlag: false,
				x: 260, y: 200,
				image: game.assets['hackforplay/finger1.png'],
				onenterframe: function() {
					if (!this.usedFlag && makeCounter) {
						this.usedFlag = true;
						this.tl.fadeOut(10).then(function() {
							this.parentNode.removeChild(this);
						});
					}
				}
			}).tl;

		})();

		// <==== Append 20150821

		Hack.monster = [];
		Hack.Blocks = [];

		Hack.MapBlocks([
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0,0,0,0, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,1,0,0,0,0,0,0, 0,0,0,2,0,0,1,1,1,0,0,2,0,0,0],
			[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2, 2,2,2,2,3,3,3,3,3,3,3,2,2,2,2]
		], Hack.Blocks, true);

		Hack.goal = Hack.createMovingSprite(96, 64, {
			x: 32 * 27, y: 32 * 7,
			image: game.assets['dot_art_world/SC-Door-Entce03.png'],
			frame: [1],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});

		Hack.key = Hack.createMovingSprite(32, 32, {
			x: 32 * 22, y: 32 * 2,
			image: game.assets['enchantjs/x2/icon0.png'],
			frame: [33],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});
		Hack.key.rotate(180);
		Hack.getkey = false;

		Hack.monster[0] = Hack.makeMonster(320, 0, 2,true, true, false, false, 46, 26, 8);

		Hack.player = Hack.createMovingSprite(40, 56, {
			x: 64, y: 0,
			image: game.assets['hackforplay/dot_syuj.png'],
			frame: [7],
			useGravity: true, useGround: true, useInput: false, useInduction: true, footHeight: 54, headHeight: 12, sideWidth: 6
		});
		Hack.player.hp = 1; // player's hit point
		touchX = Hack.player.x;
		touchY = Hack.height;

		Hack.bar = Hack.createMovingSprite(32 * 15, 48, {
			x: 0, y: 0,
			image: game.assets['dots_design/bg10_3.gif'],
			frame: [0],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});
		Hack.bar_blocks = Hack.createMovingSprite(32, 32, {
			x: 0, y: 0,
			image: game.assets['enchantjs/x2/map2.png'],
			frame: [0],
			useGravity: false, useGround: false, useInput: false, useInduction: false
		});

		Hack.bar_blocknum = new Label();
		Hack.bar_blocknum.font = "32px fantasy";
		Hack.bar_blocknum.color = "#0000ff";
		Hack.bar_time = new Label();
		Hack.bar_time.font = "32px fantasy";
		Hack.bar_time.color = "#0000ff";
		Hack.defaultParentNode.addChild(Hack.bar_blocknum);
		Hack.defaultParentNode.addChild(Hack.bar_time);

		game.rootScene.addEventListener('touchstart', function(e){
			if(Hack.gamestate == 1){this.removeEventListener('touchstart', arguments.callee);return;}
			touchX = e.localX + cam.x;
			touchY = e.localY + cam.y;
			boolCollided = false;
			touchMode = 'Create';
			if( e.localY < 64){
				boolCollided = true;
			}
			if(touchX >= Hack.player.x + Hack.player.sideWidth && touchX <= Hack.player.x - Hack.player.sideWidth + Hack.player.width &&
				touchY  >= Hack.player.y + Hack.player.headHeight && touchY < Hack.player.y + Hack.player.footHeight){
				touchMode = 'Induction';
				boolCollided = true;
			}
			else if( ( (parseInt(touchX/32) * 32 >= Hack.player.x + Hack.player.sideWidth && parseInt(touchX/32) * 32 <= Hack.player.x - Hack.player.sideWidth + Hack.player.width) ||
			 	( (parseInt(touchX/32)+1) * 32 >= Hack.player.x + Hack.player.sideWidth && (parseInt(touchX/32)+1) * 32 <= Hack.player.x - Hack.player.sideWidth + Hack.player.width) ||
			 	( parseInt(touchX/32) * 32 <= Hack.player.x + Hack.player.sideWidth && (parseInt(touchX/32)+1) * 32 >= Hack.player.x + Hack.player.sideWidth) ) &&
				( (parseInt(touchY/32) * 32 >= Hack.player.y + Hack.player.headHeight && parseInt(touchY/32) * 32 < Hack.player.y + Hack.player.footHeight) ||
				( (parseInt(touchY/32)+1) * 32 >= Hack.player.y + Hack.player.headHeight && (parseInt(touchY/32)+1) * 32 < Hack.player.y + Hack.player.footHeight) ) ){
				boolCollided = true;
			}
			else if( ( (parseInt(touchX/32) * 32 >= Hack.goal.x + 1 && parseInt(touchX/32) * 32 <= Hack.goal.x + Hack.goal.width - 1) ||
			 	(parseInt(touchX/32)+1) * 32 >= Hack.goal.x + 1 && (parseInt(touchX/32)+1) * 32 <= Hack.goal.x + Hack.goal.width - 1) &&
				( (parseInt(touchY/32) * 32 >= Hack.goal.y + 1 && parseInt(touchY/32) * 32 <= Hack.goal.y + Hack.goal.height - 1) ||
				( (parseInt(touchY/32)+1) * 32 >= Hack.goal.y + 1 && (parseInt(touchY/32)+1) * 32 <= Hack.goal.y + Hack.goal.height - 1) ) ){
				boolCollided = true;
			}
			Hack.monster.forEach(function(item) {
				if( ( (parseInt(touchX/32) * 32 >= item.x && parseInt(touchX/32) * 32 <= item.x - item.sideWidth + item.width) ||
				 	( (parseInt(touchX/32)+1) * 32 >= item.x + item.sideWidth && (parseInt(touchX/32)+1) * 32 <= item.x - item.sideWidth + item.width) ||
				 	( parseInt(touchX/32) * 32 <= item.x + item.sideWidth && (parseInt(touchX/32)+1) * 32 >= item.x + item.sideWidth) ) &&
					( (parseInt(touchY/32) * 32 >= item.y + item.headHeight && parseInt(touchY/32) * 32 < item.y + item.footHeight) ||
					( (parseInt(touchY/32)+1) * 32 >= item.y + item.headHeight && (parseInt(touchY/32)+1) * 32 < item.y + item.footHeight) ||
					( parseInt(touchY/32) * 32 <= item.y + item.headHeight && (parseInt(touchY/32)+1) * 32 >= item.y + item.headHeight) ) ){
					boolCollided = true;
				}
			});
			Hack.Blocks.forEach(function(item) {
				if(touchX >= item.x && touchX <= item.x + item.width &&
					touchY >= item.y && touchY <= item.y + item.height){
					for(var i = 0;i < Hack.Blocks.length;i++){
						if(item.x === Hack.Blocks[i].x && item.y === Hack.Blocks[i].y && item.frame <= 1){
							Hack.Blocks.splice(i, 1);
							Hack.defaultParentNode.removeChild(item);
							makeCounter++;
							break;
						}
					}
					boolCollided = true;
				}
			});
			if(!boolCollided && makeCounter >= 1 && touchMode === 'Create'){
				var B_obj = Hack.makeWall(32 * parseInt(touchX / 32), 32 * parseInt(touchY / 32) );
				Hack.Blocks.push(B_obj);
				makeCounter--;
			}
		});
		game.rootScene.addEventListener('touchend', function(e){
			touchX = Hack.player.x + Hack.player.width / 2;
			touchY = Hack.height;
		});
		game.rootScene.addEventListener('touchmove', function(e){
			if(Hack.gamestate == 1){this.removeEventListener('touchmove', arguments.callee);return;}
			touchX = e.localX + cam.x;
			touchY = e.localY + cam.y;
		});

		Hack.goal.on('enterframe', function(event) {
			if(Hack.goal.x + Hack.goal.width/2 >= Hack.player.x + 6 && Hack.goal.x + Hack.goal.width/2 <= Hack.player.x + Hack.player.width - 6 &&
				Hack.goal.y + Hack.goal.height/2 >= Hack.player.y + Hack.player.headHeight &&
				Hack.goal.y + Hack.goal.height/2 <= Hack.player.y + Hack.player.footHeight && Hack.player.OnBlocks && Hack.getkey && Hack.gamestate == 0){
				game.assets[BGM].stop();
				Hack.player.useInput = false;
				Hack.player.useInduction = false;
				Hack.player.velocity.x = 0;
				Hack.player.velocity.y = 0;
				Hack.player.x = Hack.goal.x + Hack.goal.width/2 - Hack.player.width/2;
				Hack.player.frame = [9,9,9,10,10,10,11,11,11,10,10,10];
				Hack.player.tl.fadeOut(20);
				Hack.gamestate = 2;
				Hack.gameclear();
			}

		});
		Hack.key.on('enterframe', function(event) {
			if(Hack.key.x + Hack.key.width/2 >= Hack.player.x + 6 && Hack.key.x + Hack.key.width/2 <= Hack.player.x + Hack.player.width - 6 &&
				Hack.key.y + Hack.key.height/2 >= Hack.player.y + Hack.player.headHeight &&
				Hack.key.y + Hack.key.height/2 <= Hack.player.y + Hack.player.footHeight){
				Hack.getkey = true;
				Hack.goal.frame = [1,1,1,1,1,5,5,5,5,5,9,9,9,9,9,13,null];
				Hack.defaultParentNode.removeChild(Hack.key);
			}
		});
		Hack.bar.on('enterframe', function(){
			if(Hack.gamestate == 0){
				Hack.displayTime = Hack.limitTime - Math.floor( game.frame/game.fps );
			}

			if(Hack.displayTime <= 0){
				Hack.player.hp = 0;
			}
		});
		/*スクロール座標*/
		Hack.player.on('enterframe',function(){
		   	if(Hack.player.hp <= 0){
				Hack.player.tl.fadeOut(5).then(function(){Hack.defaultParentNode.removeChild(Hack.player);});
				Hack.gamestate = 1;
				Hack.gameover();
			}
		});
		Hack.hint = 'null';
		Hack.gamestate = 0;
	};

	game.onenterframe = game.onenterframe || function() {
		if(Hack.gamestate < 0){return;}
		if(game.assets[BGM] !== undefined){
			if(!game.assets[BGM].src){
				game.assets[BGM].play();
			}
		}

		if(Hack.player.x > 224 && Hack.player.x < Hack.width - 256){
		  		cam.x = Hack.player.x - 224;
	  	}
		else if(Hack.player.x <= 224){
			cam.x = 0;
	   	}
	   	var Py = parseInt(Hack.player.y/32) * 32;
	  	if(Py > Hack.height - 192){
			cam.y = Hack.height - 320;
	   	}
	   	else if(Py > 96){
	   		cam.y = Py - 128;
	   	}
		game.rootScene.x = -1 * cam.x;
		game.rootScene.y = -1 * cam.y;
		Hack.backgroundImage.x = cam.x;
		Hack.backgroundImage.y = cam.y + 48;
		Hack.bar.x = cam.x;
		Hack.bar.y = cam.y;
		Hack.bar_blocks.x = cam.x + 370;
		Hack.bar_blocks.y = cam.y + 8;
		Hack.bar_blocknum.x = cam.x + 410;
		Hack.bar_blocknum.y = cam.y + 4;
		Hack.bar_blocknum.text = '× ' + makeCounter;
		Hack.bar_time.x = cam.x + 200;
		Hack.bar_time.y = cam.y + 6;
		Hack.bar_time.text = 'Time: ' + Hack.displayTime;
	};

	// Environments and classes
	//Hack.groundHeight = 32 * 10; // define ground distance from Y=0
	Hack.gravity = { x: 0, y: 1 };
	Hack.MovingSprite = enchant.Class.create(enchant.Sprite, {
		initialize: function(width, height) {
			enchant.Sprite.call(this, width, height);
			this.useInput = false;
			this.useInduction = false;
			this.OnGround = false;
			this.OnBlocks = false;
			this.OnY = 0;
			this.velocity = { x: 0, y: 0 };
		},
		onenterframe: function() {
			var obj = this;
			obj.OnBlocks = false;
			Hack.Blocks.forEach(function(item) {
				if(Math.abs(obj.x+obj.sideWidth-item.x) <= (obj.width-obj.sideWidth*2+item.width)/2 &&
					Math.abs(obj.y+obj.headHeight-item.y) <= (obj.footHeight+item.height)/2){
					if( (obj.x + obj.width/4*3 > item.x && obj.x + obj.width/4 < item.x + item.width) &&
						obj.y + obj.footHeight >= item.y + item.width/2 && obj.y < item.y - item.height/2 &&  item.frame === 10){
							obj.hp--;
							return;
					}
					if(obj.y + obj.footHeight >= item.y && obj.y < item.y - item.height){
						if(( (obj.x + obj.width/4*3 > item.x && obj.x + obj.width/4 < item.x + item.width) ||
							(item.series === 3 || (obj.x < item.x && item.series === 1) || (obj.x > item.x && item.series === 2)) ) && item.frame !== 10){
							obj.OnBlocks = true;
							obj.velocity.y = 0;
							obj.OnY = item.y;
							obj.y = item.y - obj.footHeight;
						}
						else if(item.frame !== 10){
							obj.OnBlocks = false;
							if(obj.x < item.x){
								obj.velocity.x = 0;
								obj.x = item.x - obj.width + obj.sideWidth;
							}
							else{
								obj.velocity.x = 0;
								obj.x = item.x + item.width - obj.sideWidth;
							}
						}
					}
					else if(obj.x + obj.width - obj.sideWidth >= item.x && obj.x + obj.width <= item.x + 10){
						obj.velocity.x = 0;
						obj.x = item.x - obj.width + obj.sideWidth;
						if(obj.direction !== undefined)obj.direction = -1;
					}
					else if(obj.x + obj.sideWidth <= item.x + item.width && obj.x >= item.x + item.width - 10){
						obj.velocity.x = 0;
						obj.x = item.x + item.width - obj.sideWidth;
						if(obj.direction !== undefined)obj.direction = 1;
					}
					else if(obj.y + obj.headHeight <= item.y + item.height && obj.y > item.y){
						obj.velocity.y = 0;
						obj.y = item.y + item.height - obj.headHeight;
					}
				}
			});

			if (this.useGround) {
				if(this.useGravity){
					this.velocity.x += Hack.gravity.x;
					this.velocity.y += Hack.gravity.y;
				}
				var foot = this.y + (this.footHeight || this.height);
				if (foot >= Hack.height) {
					this.OnGround = true;
					this.y = Hack.height - (this.footHeight || this.height);
					this.velocity.y = 0;
				}
				if (this.x < 0) {
					this.x = 0;
					this.velocity.x = 0;
					if(obj.direction !== undefined)obj.direction = 1;
				}
				if (this.x + this.width >= Hack.width) {
					this.x = Hack.width - this.width;
					this.velocity.x = 0;
					if(obj.direction !== undefined)obj.direction = -1;
				}
				if(this.y + this.headHeight < 0){
					this.y = -this.headHeight;
					this.velocity.y = 0;
				}
				if(this.OnBlocks){
					this.y = this.OnY - this.footHeight;
					this.velocity.y = 0;
				}
			}
			// get a foot on the ground

			if(this.useInput){
				if (game.input.up && (this.OnGround || this.OnBlocks) ){
					this.OnBlocks = false;
					this.OnGround = false;
					this.velocity.y = -10;
				}
    	   		if(game.input.right){
        			this.velocity.x = 3;
   		       		this.frame = 7;
   		       	}
    	   	   	else if(game.input.left){
   		       		this.velocity.x = -3;
   		       		this.frame = 4;
		       	}
		       	else{
		       		this.velocity.x = 0;
		       	}
	    	}

	    	if(this.useInduction && touchMode === 'Induction'){
	    		if(this.y + this.headHeight > touchY && (this.OnGround || this.OnBlocks) ){
	    			this.OnBlocks = false;
					this.OnGround = false;
					this.velocity.y = -10;
	    		}
	    		if(this.x + this.width < touchX){
	    			this.velocity.x = 3;
   		       		this.frame = 7;
	    		}
	    		else if(this.x > touchX){
	    			this.velocity.x = -3;
   		       		this.frame = 4;
	    		}
	    		else{
		       		this.velocity.x = 0;
		       	}
	    	}
	    	if(this.direction !== undefined){
	    		if(this.direction === 1){
					this.velocity.x = 1;
				}
				else{
					this.velocity.x = -1;
				}
			}

	    	this.moveBy(this.velocity.x, this.velocity.y);
	    },
	});

	Hack.createMovingSprite = function(width, height, prop) {
		return (function () {
			// @ new Hack.MovingSprite()
			if (prop) {
				Object.keys(prop).forEach(function(key) {
					this[key] = prop[key];
				}, this);
			}
			if (Hack.defaultParentNode) {
				Hack.defaultParentNode.addChild(this);
			}
			return this;

		}).call(new Hack.MovingSprite(width, height));
	};

	Hack.makeWall = function( _x, _y, _frame, _useGravity, _useGround, _useInput, _useInduction, _footHeight) {
	    var wall = Hack.createMovingSprite(32, 32, {
		x: _x || 0, y: _y || 0,
		image: game.assets['enchantjs/x2/map2.png'],
		frame: _frame || 0,
		useGravity: _useGravity || false,
		useGround:  _useGround  || false,
		useInput: _useInput || false,
		useInduction: _useInduction || false,
		footHeight: _footHeight || 32
		});
		wall.on('enterframe', function(){
			wall.series = 0;
			if(wall.frame === 1){
				wall.frame = 0;
			}
			if(wall.frame === 3){
				wall.frame = 4;
			}
			Hack.Blocks.forEach(function(item) {
				if(wall.x === item.x){
					if(wall.y - 32 === item.y){
						if(wall.frame === 0)wall.frame = 1;
						if(wall.frame === 4)wall.frame = 3;
					}
				}
				if(wall.y === item.y){
					if(wall.series === 3 || (wall.x - 32 === item.x && wall.series === 2 ) || (wall.x + 32 === item.x && wall.series === 1)){
						wall.series = 3;
					}
					else{
						if(wall.x - 32 === item.x && item.frame !== 10){
							wall.series = 1;
						}
						if(wall.x + 32 === item.x && item.frame !== 10){
							wall.series = 2;
						}
					}
				}
			});
			if(wall.frame === 10){
				wall.series = 0;
			}
		});
		return wall;
	}

	Hack.makeMonster = function (_x, _y, _frame, _useGravity, _useGround, _useInput, _useInduction, _footHeight, _headHeight, _sideWidth) {
		var monster = Hack.createMovingSprite(48, 48, {
			x: _x || 0, y: _y || 0,
			image: game.assets['enchantjs/monster1.gif'],
			frame: _frame || [2, 2, 2, 3, 3, 3],
			useGravity: _useGravity || false,
			useGround: _useGround|| false,
			useInput: _useInput || false,
			useInduction: _useInduction || false,
			footHeight: _footHeight || 48,
			headHeight: _headHeight || 0,
			sideWidth: _sideWidth || 0,
			hp: 1,
			direction: 1
		});
		monster.on('enterframe', function(){
			if(monster != Hack.player && monster.within(Hack.player, 24)){
				Hack.player.hp--;
			}
			if(monster.hp <= 0){
				monster.tl.fadeOut(5).then(function(){Hack.defaultParentNode.removeChild(monster);});
			}
		});
		return monster;
	}

	Hack.MapBlocks = function(map, array, sizebool){
		for(var x = 0; x < map[0].length; x++){
			for(var y = 0; y < map.length; y++){
				if(map[y][x] >= 1){
					var block = Hack.makeWall(32 * x, 32 * y, arrayframe[map[y][x]]);
					array.push(block);
				}
			}
		}
		if(sizebool){
			Hack.width = map[0].length * 32;
			Hack.height = map.length * 32;
		}
	};

	Hack.start();

});
