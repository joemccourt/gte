
GTE.drawBackgroundBasedOnLevel = function(canvas){

	if(GTE.level == 0){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],20,0.7,0);
	}else if(GTE.level == 1){
		GTE.bgTriGrid(canvas,GTE.colorSets['primaries'],7,0.2,0);
	}else if(GTE.level == 2){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],30,0.3,40);
	}else if(GTE.level == 3){
		GTE.bgTriGrid(canvas,GTE.colorSets['primaries'],50,0.1,40);
	}else if(GTE.level == 4){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],10,0.5,10,"diamonds");
	}else if(GTE.level == 5){
		GTE.bgTriGrid(canvas,[GTE.colors['black'],GTE.colors['white']],31,0.1,10,"split");
	}else if(GTE.level == 5){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],40,1,10,"3d");
	}else if(GTE.level == 6){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'].slice(1,4),30,1,10,"hex");
	}else if(GTE.level == 7){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],15,0.6,10,"stripes");
	}else if(GTE.level == 8){
		GTE.bgTriGrid(canvas,GTE.colorSets['pastels'],10,1,10,"halfstripes");
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
	nextInt:  function(){this.state = (1140671485*this.state+12820163) % (2 << 24);},
	getFloat: function(){this.nextInt();return this.state/(2 << 24);}
};

GTE.bgTriGrid = function(canvas,colors,nWidth,alpha,seed,type){
	var ctx = canvas.getContext('2d');
	ctx.save();

	var r3_2 = Math.sqrt(3)/2;
	var scale = canvas.width/nWidth/2/r3_2;
	var w = nWidth*2;
	var h = Math.ceil(Math.sqrt(3)*w*canvas.height/canvas.width)+1;

	var rng = GTE.rng;
	console.log(colors);
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
		ctx.fillStyle = 'rgba('+colors[k].r+','+colors[k].g+','+colors[k].b+','+alpha+')';
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