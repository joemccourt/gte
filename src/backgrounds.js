
GTE.drawBackgroundBasedOnLevel = function(canvas){

	if(GTE.level == 0){
		GTE.bgTriGrid(canvas,GTE.colorSets['xanthe'].slice(1,4),20,0.6,10,"hex");
	}else if(GTE.level == 1){
		GTE.bgTriGrid(canvas,GTE.colorSets['popIsEverything'],7,0.4,90,"halfstripes");
	}else if(GTE.level == 2){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],30,0.3,40);
	}else if(GTE.level == 3){
		GTE.bgTriGrid(canvas,GTE.colorSets['melonBallSurprise'],50,1,40);
	}else if(GTE.level == 4){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],10,0.5,10,"diamonds");
	}else if(GTE.level == 5){
		GTE.bgCircles(canvas,GTE.colorSets['petit'],50,1,14133);
	}else if(GTE.level == 6){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'].slice(1,4),30,0.45,10,"hex");
	}else if(GTE.level == 7){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],15,0.6,10,"stripes");
	}else if(GTE.level == 8){
		GTE.bgTriGrid(canvas,GTE.colorSets['voyage'],10,0.5,10,"halfstripes");
	}else if(GTE.level == 9){
		GTE.bgSquareGrid(canvas,GTE.colorSets['pastels'],30,0.5,10);
	}else if(GTE.level == 10){
		GTE.bgSquareGrid(canvas,GTE.colorSets['primaries'],60,0.3,10);
	}else if(GTE.level == 11){
		GTE.bgSquareGrid(canvas,GTE.colorSets['pastels'],5,0.2,10);
	}else if(GTE.level == 12){
		GTE.bgCircles(canvas,GTE.colorSets['aKissToAwake'],5,0.3,10);
		GTE.bgCircles(canvas,GTE.colorSets['oceanFive'],5,0.3,10);
	}else if(GTE.level == 13){
		GTE.bgTriGrid(canvas,GTE.colorSets['melonBallSurprise'].slice(0,3),30,0.6,10,"hex");
	}else if(GTE.level == 14){
		GTE.bgTriGrid(canvas,GTE.colorSets['loveFlowers'],30,0.35,10,"diamonds");
	}else if(GTE.level == 15){
		GTE.bgSquareGrid(canvas,GTE.colorSets['popIsEverything'],75,0.2,10);
	}else if(GTE.level == 16){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],50,0.3,10,"halfstripes");
	}else if(GTE.level == 17){		
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],20,0.7,0);
	}else if(GTE.level == 18){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],15,0.6,10,"hex");
	}else if(GTE.level == 19){
		GTE.bgTriGrid(canvas,GTE.colorSets['iridescentSunset'],3,1,401,"halfstripes");
	}else if(GTE.level == 20){
		GTE.bgTriGrid(canvas,GTE.colorSets['aKissToAwake'],80,1,41);
	}else if(GTE.level == 21){
		GTE.bgTriGrid(canvas,GTE.colorSets['melonBallSurprise'],5,1,41,"stripes");
	}else if(GTE.level == 22){
		GTE.bgTriGrid(canvas,GTE.colorSets['popIsEverything'],5,0.4,41,"hex");
	}else if(GTE.level == 23){
		GTE.bgCircles(canvas,GTE.colorSets['loveFlowers'],5,0.3,141);
	}else if(GTE.level == 24){
		GTE.bgSquareGrid(canvas,GTE.colorSets['loveFlowers'],75,0.2,10);
	}else if(GTE.level == 25){
		GTE.bgSquareGrid(canvas,[GTE.colors['black'],GTE.colors['white']],50,0.2,13);
	}else if(GTE.level == 26){
		GTE.bgTriGrid(canvas,GTE.colorSets['snowyOwl'],7,1,90);
	}else if(GTE.level == 27){
		GTE.bgTriGrid(canvas,[GTE.colors['black'],GTE.colors['white']],31,0.5,10,"split");
	}else if(GTE.level == 28){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],15,0.6,10,"3d");
	}else if(GTE.level == 29){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],5,0.6,41,"stripes");
		GTE.bgCircles(canvas,GTE.colorSets['snowyOwl'],50,1,71413);
	}else if(GTE.level == 30){
		GTE.bgTriGrid(canvas,GTE.colorSets['popIsEverything'],25,0.4,41,"hex");
	}else if(GTE.level == 31){
		GTE.bgSquareGrid(canvas,GTE.colorSets['voyage'],75,0.6,10);
	}else if(GTE.level == 32){
		GTE.bgTriGrid(canvas,GTE.colorSets['giantGoldfish'],65,0.6,51,"hex");
	}else if(GTE.level == 33){
		GTE.bgTriGrid(canvas,GTE.colorSets['snowyOwl'],70,0.6,41);
		GTE.bgCircles(canvas,GTE.colorSets['pastels'],50,0.3,71413);
	}else if(GTE.level == 34){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],50,0.5,10,"diamonds");
	}else if(GTE.level == 35){
		GTE.bgTriGrid(canvas,GTE.colorSets['iridescentSunset'],30,0.3,41);
	}else if(GTE.level == 36){
		GTE.bgSquareGrid(canvas,GTE.colorSets['voyage'],70,1,41);
		GTE.bgCircles(canvas,GTE.colorSets['voyage'],50,1,71413);
	}else if(GTE.level == 37){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],5,1,4191,"stripes");
	}else if(GTE.level == 38){
		GTE.bgCircles(canvas,GTE.colorSets['pastels'],50,0.3,741413);
		GTE.bgTriGrid(canvas,GTE.colorSets['popIsEverything'],5,0.15,4191,"stripes");
		GTE.bgCircles(canvas,GTE.colorSets['pastels'],50,0.3,71413);
	}else if(GTE.level == 39){
		GTE.bgTriGrid(canvas,GTE.colorSets['loveFlowers'],75,0.4,10);
	}else if(GTE.level == 40){
		GTE.bgTriGrid(canvas,GTE.colorSets['giantGoldfish'],19,0.4,51);
	}else if(GTE.level == 41){
		GTE.bgTriGrid(canvas,GTE.colorSets['popIsEverything'],25,0.2,411);
	}else if(GTE.level == 42){
		GTE.bgCircles(canvas,[GTE.colors['particleBlue'],GTE.negateColor(GTE.colors['particleBlue'])],50,0.4,1413);
		GTE.bgSquareGrid(canvas,[GTE.colors['black'],GTE.colors['white']],50,0.2,43);
		GTE.bgCircles(canvas,[GTE.colors['black'],GTE.colors['white']],50,0.4,113);
	}else if(GTE.level == 43){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],15,0.4,10,"3d");
		GTE.bgSquareGrid(canvas,[GTE.colors['black'],GTE.colors['white']],50,0.2,43);
	}else if(GTE.level == 44){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],15,0.6,106);
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],50,0.2,1230);
	}else if(GTE.level == 45){
		GTE.bgTriGrid(canvas,[GTE.colors['black'],GTE.colors['white']],50,0.1,1230);
		GTE.bgCircles(canvas,[GTE.colors['black'],GTE.colors['white']],50,0.2,113);
	}else if(GTE.level == 46){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],9,0.4,710,"diamonds");
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],80,0.2,10,"diamonds");
	}else if(GTE.level == 47){
		GTE.bgTriGrid(canvas,GTE.colorSets['petit'],5,1,41,"stripes");
	}else if(GTE.level == 48){
		GTE.bgTriGrid(canvas,GTE.colorSets['oceanFive'],55,0.4,4191,"stripes");
	}else if(GTE.level == 49){
		GTE.bgSquareGrid(canvas,GTE.colorSets['xanthe'],50,0.3,433);
	}else if(GTE.level == 50){
		GTE.bgCircles(canvas,GTE.colorSets['snowyOwl'],80,0.5,7134);
		GTE.bgSquareGrid(canvas,GTE.colorSets['snowyOwl'],80,0.5,433);
		GTE.bgCircles(canvas,GTE.colorSets['snowyOwl'],80,0.5,4334);
	}
};

GTE.drawTriAtCoord = function(ctx, x, y, scale){
	var r3_2 = Math.sqrt(3)/2;
	var offsetX = 0;
	var offsetY = -1;
	var gridColor = [0,0,0];

	var startX = (x+offsetX) * scale * r3_2;
	var startY = 0.5 * scale * (y+offsetY);

	var v1x = startX;
	var v1y = startY;

	var v2x = startX+scale*r3_2;
	var v2y = startY+scale*0.5;

	var v3x = startX;
	var v3y = startY+scale;

	//If triangle pointing left flip x coords
	if((x+y)%2==1){
		v2x -= scale * r3_2;
		v1x += scale * r3_2;
		v3x += scale * r3_2;
	}

	ctx.moveTo(v1x,v1y);
	ctx.lineTo(v2x,v2y);
	ctx.lineTo(v3x,v3y);
	ctx.lineTo(v1x,v1y);
};
	
GTE.rng = {
	state: 0,
	setSeed:  function(seed){this.state = seed;},
	nextInt:  function(){this.state = (22695477*this.state+1) % 4294967296;},
	getFloat: function(){this.nextInt();return this.state / 4294967296;}
};

GTE.bgTriGrid = function(canvas,colors,nWidth,alpha,seed,type){
	var ctx = canvas.getContext('2d');
	ctx.save();

	var r3_2 = Math.sqrt(3)/2;
	var scale = canvas.width/nWidth/2/r3_2;
	var w = nWidth*2;
	var h = Math.ceil(Math.sqrt(3)*w*canvas.height/canvas.width)+1;

	var rng = GTE.rng;
	rng.setSeed(seed);

	var map = [];
	// var colors = GTE.colorSets['pastels'];//[[205,255,149],[255,171,97],[157,237,243],[223,253,255],[34,133,187]];
	for(var y = 0; y < h; y++){
		for(var x = 0; x < w; x++){
			map[w*y+x] = rng.getFloat()*colors.length|0;
			if(type == "diamonds"){
				if((x+y)%2==0&&x!=0){
					map[w*y+x] = map[w*y+x-1]
				}
			
			}else if(type == "split"){
				if(x >= w/2){
					map[w*y+x] = Math.floor(x/2+y/2+1)%2;
				}else{
					map[w*y+x] = (Math.floor(x/2+h-y/2)+h%2)%2;
				}
			}else if(type == "halfstripes"){
				map[w*y+x] = (x+y)%colors.length;
			}else if(type == "stripes"){
				map[w*y+x] = Math.floor((x+y+1)/2)%colors.length;
			}else if(type == "spiky"){
				map[w*y+x] = Math.floor((x+y)/4)%colors.length;
			}else if(type == "3d"){
				map[w*y+x] = Math.floor((x+y)/4+y)%2;
			}else if(type == "hex"){
				var yOff = Math.floor(y/3);
				map[w*y+x] = Math.floor((x+yOff+1)/2+yOff)%colors.length;
			}
		}
	}
    
    for(var k = 0; k < colors.length; k++){
		ctx.beginPath();
		ctx.fillStyle = GTE.colorToStr(colors[k],alpha);
		for(var y = 0; y < h; y++){
				for(var x = 0; x < w; x++){
				if(map[w*y+x] == k){
					GTE.drawTriAtCoord(ctx,x,y,scale);
				}
			}
		}
		ctx.fill();
    }

	ctx.restore();
};


//TODO: use space filling tree
GTE.bgCircles = function(canvas,colors,nWidth,alpha,seed,type){
	var ctx = canvas.getContext('2d');
	ctx.save();

	var w = canvas.width;
	var h = canvas.height;

	var rng = GTE.rng;
	rng.setSeed(seed);

	var circles = [];

	var r0 = w/20;
	for(var i = 0; i < 1000; i++){
		var k = rng.getFloat()*colors.length|0;
		var r = 0;//rng.getFloat()*w/5;\

		var x,y;

		var p = 0;
		while(r <= 0){
			x = w*rng.getFloat();
			y = h*rng.getFloat();
			
			var minR = r0;

			//Box boundries
			if(x < minR){minR = x;}
			if(w-x < minR){minR = w-x;}
			if(x < w/2 && w/2-x < minR){minR = w/2-x;}
			if(x > w/2 && x-w/2 < minR){minR = x-w/2;}
			if(y < minR){minR = y;}
			if(h-y < minR){minR = h-y;}

			//Other circle boundries
			for(var j = 0; j < circles.length && minR > 0; j++){
				var circle = circles[j];
				var dist = Math.pow(x-circle.x,2)+Math.pow(y-circle.y,2) - Math.pow(circle.r+minR,2);
				if(dist < 0){
					dist = Math.sqrt(Math.pow(x-circle.x,2)+Math.pow(y-circle.y,2)) - circle.r;
					minR = dist;
				}
			}
			r = minR;
			p++;
		}

		circles.push({x:x,y:y,r:r});

		ctx.fillStyle = GTE.colorToStr(colors[k],alpha);
		ctx.beginPath();
		ctx.arc(x,y,r, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
    }

	ctx.restore();
};

GTE.bgSquareGrid = function(canvas,colors,nWidth,alpha,seed,type){
	var ctx = canvas.getContext('2d');
	ctx.save();

	var scale = canvas.width/nWidth/2;
	var w = nWidth*2;
	var h = Math.ceil(w*canvas.height/canvas.width);

	var rng = GTE.rng;
	rng.setSeed(seed);

	var map = [];

	for(var y = 0; y < h; y++){
		for(var x = 0; x < w; x++){
			map[w*y+x] = rng.getFloat()*colors.length|0;
		}
	}
    
    for(var k = 0; k < colors.length; k++){
		ctx.beginPath();
		ctx.fillStyle = GTE.colorToStr(colors[k],alpha);
		for(var y = 0; y < h; y++){
			for(var x = 0; x < w; x++){
				if(map[w*y+x] == k){
					ctx.moveTo(scale*x,scale*y);
					ctx.lineTo(scale*(x+1),scale*y);
					ctx.lineTo(scale*(x+1),scale*(y+1));
					ctx.lineTo(scale*x,scale*(y+1));
					ctx.lineTo(scale*x,scale*y);
				}
			}
		}
		ctx.fill();
    }

	ctx.restore();
};