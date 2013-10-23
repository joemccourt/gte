function drawTriAtCoord(x, y, scale){
	var ctx = GTE.ctx;
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
	nextInt: function(){this.state = (1140671485*this.state+12820163) % (2 << 24);},
	getFloat: function(){this.nextInt();return this.state/(2 << 24);}
};

GTE.bgCanvas = 

GTE.bgTriGrid = function(){
	var ctx = GTE.ctx;
	ctx.save();

	var w = 50;
	var h = 25;
	var scale = 40;
	var alpha = 0.5;

	var rng = GTE.rng;
	rng.state = 0;

	var map = [];
	var colors = [[205,255,149],[255,171,97],[157,237,243],[223,253,255],[34,133,187]];
	for(var y = 0; y < h; y++){
		for(var x = 0; x < w; x++){
			map[w*y+x] = rng.getFloat()*colors.length|0;
		}
	}
    
    for(var k = 0; k < colors.length; k++){
		ctx.beginPath();
		ctx.fillStyle = 'rgba('+colors[k][0]+','+colors[k][1]+','+colors[k][2]+','+alpha+')';
		for(var y = 0; y < h; y++){
				for(var x = 0; x < w; x++){
				if(map[w*y+x] == k){
					drawTriAtCoord(x,y,scale);
				}
			}
		}
		ctx.fill();
    }

	ctx.restore();
};