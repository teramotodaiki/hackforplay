window.addEventListener('load', function () {

	Hack.restagingCode = function () {
		/**
		* Introduction;
		*
		* このゲームは、すいせい（コメット）を おいかけて
		* わっか（リング）をあつめる ゲームです
		*
		* おんがくの リズムにあわせて コメットをうごかし
		* メディアアートを たいけん してみましょう
		*
		*
		* Musics;
		*
		*     曲名 name
		*   birthday-song
		*   senko-hanabi
		*   travelers-summer
		*   chicken-steak
		*   shiawase-no-himitsu
		*   hands
		*
		*/
		Hack.music = {
			track: 238023166,
			length: 30
		};

		/**
		* Settings;
		*
		* ringTime:    リングがでてから はじけるまでの じかん
		* quota:       クリアするために ひつような OK の かず
		* hitSE:       OK のときの こうかおん（SE ... サウンドエフェクト）
		* coverOpacity:はいけいの あかるさ. 0 から 1 の すうち
		* notesInTime: ひとくぎりのなかで でてくる リングのかず
		*
		* ringTime を おおきくすると、OK が でやすくなります
		* quota を おおきくすると、クリアが むずかしく なります
		* notesInTime を おおきくすると、よりこまかく きざめます
		*
		*/
		Hack.ringTime = 1.0;
		Hack.quota = 40;
		Hack.hitSE = 0;
		Hack.coverOpacity = 0.2;
		Hack.notesInTime = 8;


		/**
		* setup;
		*
		* ゲームが はじまったときに コールされる
		*
		*/
		Hack.setup = function (comet) {

			comet.x = 0;
			comet.y = 170;

		};

		/**
		* update;
		*
		* ゲームが つづいているあいだ つねに コールされる
		* time（タイム）には けいかじかんが はいっている
		*
		*/
		Hack.update = function (
		comet, time, x, y, px, py, speed, vx, vy,
		setPosition, setSpeed, setVelocity, setForce, setNotes,
		setPositionOn, setSpeedOn, setVelocityOn, setForceOn, setNotesOn) {

			// さいしょの うごき
			setPositionOn( 0,   0, 170); // ひだりから 0px, うえから 170px の いち
			setVelocityOn( 0,  53,   0); // みぎに 53px/sec, うえに 0px/sec の はやさ

			// 18秒のとき、はずむような うごき
			setPositionOn(18,   0, 170);
			setVelocityOn(18,  80,   0);
			setForceOn(   18,   0, 300);

			// 49秒から 64秒まで ずっと、だえんを えがく うごき
			setPositionOn(49, 400, 200);
			setVelocityOn(49,   0,  70);
			if (49 < time && time < 65) {
				setForce((240 - x) * 0.3, (160 - y) * 0.3);
			}

			// 65秒から 100秒（さいご）まで ずっと、なみのような うごき
			setPositionOn(65, 140, 240);
			setVelocityOn(65,-160,   0);
			if (65 < time && time < 100) {
				setForce(0, (200 - y) * 10);
			}

			/**
			* setNotesOn(time, a,b,c,d, e,f,g,h, i,j,k,l, m,n,o,p);
			*
			* タイミングを せっていする
			*
			* time:    せっていする じかん [sec]
			* a,...p:  1なら でる. 0なら でない
			*
			*/
			setNotesOn(  0.0, 1,1,1,1,1,1,1,1, 1,1,1,1,1,1,1,1);
			setNotesOn( 18.0, 1,0,0,0,0,0,0,0, 1,0,0,0,0,0,0,0);
			setNotesOn( 48.5, 0,0,0,0,0,0,0,0, 0,0,0,0,0,1,1,0);
			setNotesOn( 63.5, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0);
			setNotesOn( 65.0, 1,0,0,0,1,0,0,0, 1,0,1,0,1,0,0,0);
			setNotesOn( 80.0, 1,0,1,0,1,0,0,0, 1,0,0,0,1,0,0,0);
			setNotesOn( 96.2, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0);

		};

		/**
		* draw;
		*
		* コメットの 軌跡（きせき）について かかれている
		* いろ や ふとさ などを かえられる
		*
		*/
		Hack.draw = function (
		comet, time, x, y, px, py, speed, vx, vy,
		line, rect, triangle, quad, point, ellipse, bezier,
		stroke, noStroke, strokeWeight, fill, noFill,
		text, textFont, textSize, clearRect) {

			/**
			* COLORS(色の作り方);
			*
			* white(白):    (255,255,255)
			* gray(灰):     (127,127,127)
			* black(黒):    (  0,  0,  0)
			* red(赤):      (255,  0,  0)
			* green(緑):    (  0,255,  0)
			* blue(青):     (  0,  0,255)
			* yellow(黄):   (255,255,  0)
			*
			* Transparent colors(透明色);
			*
			* light blue(明るい青):    (  0,  0,255,0.9);
			* dark blue(くらい青):     (  0,  0,255,0.4);
			*
			* ... もっと知りたい人は、「光の三原色」について しらべよう！
			* ... The three primary colors.
			*
			*/
			stroke(255,255,  0);


			// 線を引く
			strokeWeight(1);
			line(x, y, px, py);


			// 19秒よりあとで、33秒までのあいだ
			if (19 < time && time < 33) {

				// あしもとに しろい てん
				fill(255,255,255);
				point(x, 300);

			}

			// 33秒よりあとで、49秒までのあいだ
			if (33 < time && time < 49) {

				// あしもとに しろい だえん
				noStroke();
				fill(255,255,255,0.5);
				ellipse(x - 2, y + 20, 4, 300 - y);

			}

			// 49秒よりあとで、65秒までのあいだ
			if (49 < time && time < 65) {

				// 中心 から さんかく... (240, 160) = 中心
				noStroke();
				fill(  0,255,255,0.5);
				triangle(240, 160, x, y, px, py);

			}

			// 65秒よりあとで、100秒までのあいだ
			if (65 < time && time < 100) {

				// 右上と左下から さんかく ... (480, 0) = 右上, (0, 320) = 左下
				noStroke();
				fill(  0,255,255,0.5);
				triangle(480,   0, x, y, px, py);
				triangle(  0, 320, x, y, px, py);

			}

			// 81秒よりあとで、100秒までのあいだ
			if (81 < time && time < 100) {

				// 左上と右下から さんかく ... (0, 0) = 左上, (480, 320) = 右下
				noStroke();
				fill(255,128,128,0.5);
				triangle(  0,   0, x, y, px, py);
				triangle(480, 320, x, y, px, py);

			}

			// 全体をぼかす
			noStroke();
			fill(0, 0, 0, 0.1);
			rect(0, 0, 480, 320);

		};
	};
});
