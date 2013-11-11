"use strict";

GTE.drawBoardGameBox = [-0.1,-2,1.1,1.1];
GTE.drawBoardGameTransform = [1,0,0,0,
							  0,1,0,0,
							  0,0,1,0];
GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform.slice(0);
GTE.boardLevelRadius = 0.036;
GTE.dirtyBoardGameBackground = true;

GTE.setBoardRenderBox = function(){
	var w = GTE.canvas.width;
	var h = GTE.canvas.height;
	GTE.renderBox = [w*0.02+0.5|0,h*0.02+0.5|0,w*0.98+0.5|0,h*0.98+0.5|0];
};

// *** Events ***
GTE.mouseupBoard = function(x,y){
	GTE.mouse = "up";
	GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
	GTE.saveGameState();
};

GTE.mousedownBoard = function(x,y){
	GTE.mouseDownLast = {x:x,y:y};
	GTE.drawBoardGameTransform = GTE.drawBoardGameTransformTmp;

	var w  = GTE.getRenderBoxWidth();
	var h  = GTE.getRenderBoxHeight();
	var x1 = GTE.renderBox[0];
	var y1 = GTE.renderBox[1];

	var posC = GTE.getTransformedCoordsInv(GTE.drawBoardGameTransform,x,y);
	//console.log("["+posC[0].toFixed(2)+","+posC[1].toFixed(2)+"]");
	var pC = GTE.internalToRenderSpace(posC[0],posC[1]);

	var coords = GTE.levelCoords;
	var r = GTE.boardLevelRadius * (w+h)/2;
	for(var i = 0; i < coords.length; i++){
		var posL = GTE.internalToRenderSpace(coords[i][0],coords[i][1]);
		var pL = posL;
		// var pL   = GTE.getTransformedCoords(GTE.drawBoardGameTransform,posL[0],posL[1]);

		var unlocked = false;
		if(i > 0){
			var stars = GTE.userStats['level'+(i-1)];
			if(stars != null){
				if(stars.stars > 0){
					unlocked = true;
				}
			}
		}else{
			unlocked = true;
		}

		if(unlocked&&Math.pow(pC[0]-pL[0],2)+Math.pow(pC[1]-pL[1],2) < r*r){
			GTE.selectLevel(i);
			break;
		}
	}
};

GTE.mousemoveBoard = function(x,y){
	if(GTE.mouse == "down"){
		GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, x - GTE.mouseDownLast.x, y - GTE.mouseDownLast.y);
		GTE.dirtyCanvas = true;	
		GTE.mouseDownLast = {x:x,y:y};
	}
};

GTE.keydownBoard = function(k){

	// 37 - left 65 - a
	// 38 - up  87 - w
	// 39 - right 68 - d
	// 40 - down 83 - s

	if(k == 37 || k == 65){
		GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, 0.05, 0);
		GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
		GTE.saveGameState();
		GTE.dirtyCanvas = true;
	}else if(k == 39 || k == 68){
		GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, -0.05, 0);
		GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
		GTE.saveGameState();
		GTE.dirtyCanvas = true;
	}else if(k == 38 || k == 87){
		GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, 0, 0.05);
		GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
		GTE.saveGameState();
		GTE.dirtyCanvas = true;
	}else if(k == 40 || k == 83){
		GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, 0,-0.05);
		GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
		GTE.saveGameState();
		GTE.dirtyCanvas = true;
	}
};

// *** Transforms ***
GTE.getTransformedCoords = function(t,x,y){
	var xNew = t[0]*x+t[1]*y+t[3];
	var yNew = t[4]*x+t[5]*y+t[7];

	return [xNew,yNew];
};

//TODO: make this actually inv
GTE.getTransformedCoordsInv = function(t,x,y){
	var xNew = x-t[3];
	var yNew = y-t[7];

	return [xNew,yNew];
};

GTE.transfromTranslate = function(t,x,y){
	var newT = t.slice(0);
	newT[3] += x;
	newT[7] += y;

	var gameBox = GTE.drawBoardGameBox;

	var offX = -newT[3];
	var offY = -newT[7];

	offX = offX < gameBox[0]   ? gameBox[0]   : offX;
	offX = offX > gameBox[2]-1 ? gameBox[2]-1 : offX;

	offY = offY < gameBox[1]   ? gameBox[1]   : offY;
	offY = offY > gameBox[3]-1 ? gameBox[3]-1 : offY;

	newT[3] = -offX;
	newT[7] = -offY;

	return newT;
};
