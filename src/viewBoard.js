"use strict";

GTE.drawBoardGame = function(){
	GTE.drawBoardBackground();
	GTE.drawBoardLevels();
	GTE.drawBoardBorder();
	GTE.drawStarCount();
};

GTE.setBoardTransform = function(ctx){

	//TODO: make this work for scaling
	var w  = GTE.getRenderBoxWidth();
	var h  = GTE.getRenderBoxHeight();
	var x1 = GTE.renderBox[0];
	var y1 = GTE.renderBox[1];

	var trans = GTE.drawBoardGameTransform;

	var offX = w*trans[3];
	var offY = h*trans[7];

	var scaleX = trans[0];
	var scaleY = trans[5];

	ctx.transform(1,0,0,1,offX,offY);
};

GTE.drawBoardBackground = function(){
	var gameBox = GTE.drawBoardGameBox;
	var ctx = GTE.ctx;

	ctx.clearRect(0,0,GTE.canvas.width,GTE.canvas.height);

	ctx.save();
	GTE.setBoardTransform(ctx);

	var w  = GTE.getRenderBoxWidth();
	var h  = GTE.getRenderBoxHeight();
	var trans = GTE.drawBoardGameTransform;

	var offX = w*trans[3];
	var offY = h*trans[7];
		
	var paraX = -0.25;
	var paraY = -0.25;

	var boardWidth  = w*(gameBox[2]-gameBox[0]);
	var boardHeight = h*(gameBox[3]-gameBox[1]);
	var boardStartX = GTE.renderBox[0]+gameBox[0]*w;
	var boardStartY = GTE.renderBox[1]+gameBox[1]*h;

	//Rather hacky, but it works :/
	var drawOffX = w * 0; //TODO: perfect
	var drawOffY = h * 0; //TODO: perfect

	if(!GTE.boardGameCanvas || GTE.dirtyBoardGameBackground){
		GTE.dirtyBoardGameBackground = false
		GTE.boardGameCanvas = document.createElement('canvas');
		GTE.boardGameCanvas.width  = boardWidth;
		GTE.boardGameCanvas.height = boardHeight;

		GTE.bgTriGrid(GTE.boardGameCanvas,GTE.colorSets['pastels'],15,0.5,40);
	}

	ctx.drawImage(GTE.boardGameCanvas,boardStartX+offX*paraX-drawOffX,boardStartY+offY*paraY-drawOffY);
	ctx.restore();
};

GTE.drawBoardLevels = function(){
	var ctx = GTE.ctx;
	ctx.save();
	GTE.setBoardTransform(ctx);

	var w  = GTE.getRenderBoxWidth();
	var h  = GTE.getRenderBoxHeight();
	var x1 = GTE.renderBox[0];
	var y1 = GTE.renderBox[1];

	// *** Draw Levels *** //
	var r = GTE.boardLevelRadius * (w+h)/2;
	var coords = GTE.levelCoords;

	ctx.beginPath();
	for(var i = 0; i < coords.length; i++){
			var i1x = x1+coords[i][0]*w;
			var i1y = y1+coords[i][1]*h;

		if(i == 0){
			var i2x = x1+coords[i+1][0]*w;
			var i2y = y1+coords[i+1][1]*h;
			ctx.moveTo(i1x,i1y);
			ctx.lineTo((i1x+i2x)/2,(i1y+i2y)/2);
		}else if(i == coords.length-1){
			var i0x = x1+coords[i-1][0]*w;
			var i0y = y1+coords[i-1][1]*h;
			ctx.moveTo((i0x+i1x)/2,(i0y+i1y)/2);
			ctx.lineTo(i1x,i1y);
		}else{
			var i2x = x1+coords[i+1][0]*w;
			var i2y = y1+coords[i+1][1]*h;
			var i0x = x1+coords[i-1][0]*w;
			var i0y = y1+coords[i-1][1]*h;

			ctx.quadraticCurveTo(i1x,i1y,(i1x+i2x)/2,(i1y+i2y)/2);
		}
	}
	ctx.strokeStyle = 'black';
	ctx.lineWidth = 3;
	ctx.stroke();

	ctx.closePath();

	for(var i = 0; i < coords.length; i++){
		var stars = GTE.userStats['level'+i];

		if(stars != null){
			stars = stars.stars;
		}else{
			if(i > 0){
				var lastStars = GTE.userStats['level'+(i-1)];
				if(lastStars && lastStars.stars > 0){
					stars = 0;
				}else{
					stars = -1;
				}
			}else{
				stars = 0;
			}
		}

		var x = x1+coords[i][0]*w;
		var y = y1+coords[i][1]*h;
	
		for(var k = 0; k <= 1; k++){
			var color;
			if(stars > 0){
				color = {r:0x44,g:0xEE,b:0x88};
			}else if(stars == 0){
				color = {r:0x88,g:0x88,b:0xFF};
			}else{
				color = {r:0xDD,g:0xDD,b:0xDD};
			}

			if(k == 1){
				color = {r:0,g:0,b:0};
			}
			
			// create radial gradient
			var grd = ctx.createRadialGradient(x-r*0.1,y-r*0.3,r*0.1,x,y,r);

			var colorShine  = {r:color.r,g:color.g,b:color.b};
			var colorShadow = {r:color.r,g:color.g,b:color.b};
			colorShine.r += 20;
			colorShine.g += 20;
			colorShine.b += 20;

			if(colorShine.r > 255){colorShine.r = 255;}
			if(colorShine.g > 255){colorShine.g = 255;}
			if(colorShine.b > 255){colorShine.b = 255;}

			colorShadow.r = colorShadow.r * 0.5 | 0;
			colorShadow.g = colorShadow.g * 0.5 | 0;
			colorShadow.b = colorShadow.b * 0.5 | 0;

			if(colorShadow.r < 0){colorShadow.r = 0;}
			if(colorShadow.g < 0){colorShadow.g = 0;}
			if(colorShadow.b < 0){colorShadow.b = 0;}

			grd.addColorStop(0, GTE.colorToStr(colorShine)); // center
			grd.addColorStop(0.9, GTE.colorToStr(color));
			grd.addColorStop(1, GTE.colorToStr(colorShadow));

			ctx.fillStyle = grd;

			if(k == 0){
				ctx.beginPath();
				ctx.arc(x, y, r, 0, 2 * Math.PI, false);
				ctx.closePath();
				ctx.fill();
			}else{	
				ctx.font = "" + (r) + "px Lucida Console";
				
				ctx.lineWidth = 1;
				ctx.strokeStyle = 'rgba(255,255,255,0.3)';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(""+i,x,y);
				ctx.strokeText(""+i,x,y);
			}
		}

	}
	
	for(var i = 0; i < coords.length; i++){
		var stars = GTE.userStats['level'+i];

		if(stars != null){
			stars = stars.stars;
		}else{
			stars = 0;
		}
		
		var x = x1+coords[i][0]*w;
		var y = y1+coords[i][1]*h;

		var rStar = 1.7*r;

		if(stars > 0){
			ctx.fillStyle = GTE.starColorStr[0];
			ctx.strokeStyle = 'rgba(0,0,0,0.3)';
			ctx.lineWidth = 2;
			var angle = 130 * Math.PI/180;
			GTE.drawStar(ctx, x+rStar*Math.cos(angle), y-rStar*Math.sin(angle), r*0.45);
			ctx.stroke();
			ctx.fill();
		}

		if(stars > 1){
			ctx.fillStyle = GTE.starColorStr[1];
			ctx.strokeStyle = 'rgba(0,0,0,0.3)';
			var angle = 90 * Math.PI/180;
			GTE.drawStar(ctx, x+rStar*Math.cos(angle), y-rStar*Math.sin(angle), r*0.45);
			ctx.stroke(	);
			ctx.fill();
		}

		if(stars > 2){
			ctx.fillStyle = GTE.starColorStr[2];
			ctx.strokeStyle = 'rgba(0,0,0,0.3)';
			var angle = 50 * Math.PI/180;
			GTE.drawStar(ctx, x+rStar*Math.cos(angle), y-rStar*Math.sin(angle), r*0.45);
			ctx.stroke();
			ctx.fill();
		}
	}

    ctx.restore();
};

GTE.drawBoardBorder = function(){
	var ctx = GTE.ctx;
	ctx.save();

	ctx.clearRect(0,0,GTE.canvas.width,GTE.renderBox[1]-0.5);
	ctx.clearRect(0,0,GTE.renderBox[0]-0.5,GTE.canvas.height);
	ctx.clearRect(0,GTE.renderBox[3]+0.5,GTE.canvas.width,GTE.canvas.height);
	ctx.clearRect(GTE.renderBox[2]+0.5,0,GTE.canvas.width,GTE.canvas.height);
	
	//Box border
	ctx.beginPath();
	ctx.moveTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
	ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[3]+0.5);
	ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[3]+0.5);
	ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[1]-0.5);
	ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
	ctx.closePath();
	ctx.strokeStyle = '000';
	ctx.lineWidth = 3;
	ctx.stroke();
	
	ctx.restore();
};

GTE.drawStarCount = function(){
	var ctx = GTE.ctx;
	ctx.save();

	var numB = 0;
	var numS = 0;
	var numG = 0;
	for(var lvl in GTE.userStats){
		if(GTE.userStats.hasOwnProperty(lvl)){
			if(GTE.userStats[lvl].stars){
				var stars = GTE.userStats[lvl].stars;
				if(stars >= 1){numB++;}
				if(stars >= 2){numS++;}
				if(stars >= 3){numG++;}
			}
		}
	}

	//TODO put this in controller
	var buttons = [
	{
		'name':'background',
		'text':'',
		'fillStyle': 'rgba(255,255,255,0.5)',
		'box': [0.94,0.01,0.99,0.2],
		'r':0.08
	}];

	var button = buttons[0];
	
	var canvasCoordTL = GTE.internalToRenderSpace(button.box[0],button.box[1]);
	var canvasCoordBR = GTE.internalToRenderSpace(button.box[2],button.box[3]);

	var x1 = canvasCoordTL[0]+0.5;
	var y1 = canvasCoordTL[1]+0.5;
	var x2 = canvasCoordBR[0]+0.5;
	var y2 = canvasCoordBR[1]+0.5;

	var r = button.r * Math.min(y2 - y1, x2 - x1);

	ctx.beginPath();
    ctx.moveTo(x1+r,y1);
    ctx.lineTo(x2-r,y1);
    ctx.arc(x2-r,y1+r,r,-Math.PI/2,0,false);
    ctx.lineTo(x2,y2-r);
    ctx.arc(x2-r,y2-r,r,0,Math.PI/2,false);
    ctx.lineTo(x1+r,y2);
    ctx.arc(x1+r,y2-r,r,Math.PI/2,Math.PI,false);
    ctx.lineTo(x1,y1+r);
	ctx.arc(x1+r,y1+r,r,Math.PI,3*Math.PI/2,false);

	ctx.closePath();

	ctx.strokeStyle = button.strokeStyle;

	ctx.fillStyle = 'rgba(255,255,255,0.7)';

	ctx.lineWidth = 2;
	ctx.fill();
	ctx.stroke();

	var h = y2-y1;
	var w = x2-x1;
	var starR = 0.15*Math.min(w,h);
	var height = 0.4*Math.min(w,h);

	for(var j = 0; j < 3; j++){
		var yStar = y1+(j+0.7)*2.1*Math.max(starR,h*0.14);
		var xStar = x1 + w*0.2;
		var xText = x1 + w*0.6;

		var num = 0;
		if(j == 0){
			num = numG;
		}else if(j == 1){
			num = numS;
		}else if(j == 2){
			num = numB;
		}

		GTE.drawStar(ctx, xStar, yStar, starR);
		ctx.lineWidth = 5;
		ctx.fillStyle = GTE.colorToStr(GTE.starColors[2-j],0.8);
		ctx.fill();

		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.font = height + "px Lucida Console";
		ctx.fillStyle = 'rgba(0,0,0,1)';
		ctx.strokeStyle = 'rgba(255,255,255,0.5)';
		ctx.lineWidth = 1;
		ctx.fillText(" "+num,xText,yStar);
		ctx.strokeText(" "+num,xText,yStar);
	}

    ctx.restore();
};