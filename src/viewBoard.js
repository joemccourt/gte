"use strict";

GTE.drawBoardGame = function(){

	var gameBox = GTE.drawBoardGameBox;
	var ctx = GTE.ctx;
	ctx.save();
	ctx.clearRect(0,0,GTE.canvas.width,GTE.canvas.height);
	ctx.restore();
	
	ctx.save();

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
				color = {r:0x44,g:0x44,b:0xEE};
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
				ctx.font = "" + (r) + "px Verdana";
				
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