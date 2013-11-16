"use strict";

//Simple center weighted AABB tree
//TODO: more effient minimum box and divide boxes based on median position
//More efficent rebuild of AABBTree
GTE.drawAABBTree = function(){
	var ctx = GTE.ctx;
	ctx.save();

	var helper = function(n){
		if(typeof n !== 'object'){return;}
		if(typeof n.box !== 'object' || n.box.length != 4){return;}

		var b = GTE.gameInternalToRenderSpace(n.box[0],n.box[1]);
		var e = GTE.gameInternalToRenderSpace(n.box[2],n.box[3]);

		ctx.moveTo(b[0],b[1]);
		ctx.lineTo(e[0],b[1]);
		ctx.lineTo(e[0],e[1]);
		ctx.lineTo(b[0],e[1]);
		ctx.lineTo(b[0],b[1]);

		helper(n.nodeLeft);
		helper(n.nodeRight);
	};

	helper(GTE.AABBTree.root);
	ctx.strokeStyle = 'rgba(255,0,0,0.2)';
	ctx.stroke();

	ctx.restore();
};

GTE.drawSpringForces = function(){
	return;
	var ctx = GTE.ctx;
	ctx.save();

	var springs =  GTE.levelState.springForces;
	for(var forceID = 0; forceID < springs.length; forceID++){
		var f = springs[forceID];
		if(typeof f !== 'object'){continue;}

		var p1 = f.p1;
		var p2 = f.p2;

		if(typeof p1 !== 'object'){continue;}
		if(typeof p2 !== 'object'){continue;}

		var canvasCoordP1 = GTE.gameInternalToRenderSpace(p1.x,p1.y);
		var canvasCoordP2 = GTE.gameInternalToRenderSpace(p2.x,p2.y);

		ctx.beginPath();
	    ctx.moveTo(canvasCoordP1[0], canvasCoordP1[1]);
	    ctx.lineTo(canvasCoordP2[0], canvasCoordP2[1]);
	    ctx.strokeStyle = '800';
	    ctx.lineWidth = 3;
	    ctx.stroke();
	}
	ctx.restore();
};


GTE.drawMouseForces = function(){

	var ctx = GTE.ctx;
	ctx.save();

	for(var forceID = 0; forceID < 10; forceID++){
		var f = GTE.levelState.mouseForces[forceID];
		if(typeof f !== 'object' || f === null){continue;}

		var found = false;
		var p;
		for(var j = 0; j < GTE.levelState.particles.length; j++){
			p = GTE.levelState.particles[j];
			if(p.id == f.pID){found = true; break;}
		}
		if(!found){continue;}


		if(typeof p !== 'object'){continue;}

		var canvasCoordP = GTE.gameInternalToRenderSpace(p.x,p.y);
		var canvasCoordF = GTE.gameInternalToRenderSpace(f.fX,f.fY);

		var num = 25;

		var vLength = Math.sqrt(Math.pow(p.x-f.fX,2)+Math.pow(p.y-f.fY,2));
		if(vLength <= 0){continue;}

		var v = {
			x:(p.x-f.fX)/vLength,
			y:(p.y-f.fY)/vLength
		};

		var n = {
			x: -v.y,
			y: v.x
		};

		var canvasCoordCtrl;

		ctx.beginPath();
	    ctx.moveTo(canvasCoordF[0], canvasCoordF[1]);
		for(var i = 0; i < num; i++){
			
			var point = {x:f.fX,y:f.fY};
			point.x += v.x*(i+1)*vLength/(num+1);
			point.y += v.y*(i+1)*vLength/(num+1);

			var pointCtrl = {x:point.x,y:point.y};
			var edge = i%2?-1:1;
			pointCtrl.x += edge*n.x*p.r*0.8;
			pointCtrl.y += edge*n.y*p.r*0.8;


			point.x += v.x*(0.5)*vLength/(num+1);
			point.y += v.y*(0.5)*vLength/(num+1);
			canvasCoordP = GTE.gameInternalToRenderSpace(point.x,point.y);
			canvasCoordCtrl = GTE.gameInternalToRenderSpace(pointCtrl.x,pointCtrl.y);

		    ctx.quadraticCurveTo(canvasCoordCtrl[0], canvasCoordCtrl[1], canvasCoordP[0], canvasCoordP[1]);
		}

		canvasCoordP = GTE.gameInternalToRenderSpace(p.x,p.y);
		ctx.lineTo(canvasCoordP[0], canvasCoordP[1]);

		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';
	    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
	    ctx.lineWidth = 2;
	    ctx.stroke();
	}
	ctx.restore();
};

GTE.drawDensity = function(){

	var ctx = GTE.ctx;
	ctx.save();

	var gameBoxTL = GTE.gameInternalToRenderSpace(0,0);
	var gameBoxBR = GTE.gameInternalToRenderSpace(2,1*GTE.getYScale());

	var w = Math.ceil(gameBoxBR[0] - gameBoxTL[0]);
	var h = Math.ceil(gameBoxBR[1] - gameBoxTL[1]);
	
	var newData = ctx.createImageData(w,h);
	var src = newData.data;

	for(var y = 0; y < h; y++){
		for(var x = 0; x < w; x++){
			var index = 4*(w*y+x);
			src[index  ] = 127;
			src[index+1] = 127;
			src[index+2] = 127;
			src[index+3] = 255;
		}
	}

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		var pCoords = GTE.gameInternalToRenderSpace(p.x,p.y);
		pCoords[0] -= gameBoxTL[0];
		pCoords[1] -= gameBoxTL[1];

		var r = 100;
		var r2 = r*r;
		var xMin = pCoords[0] - r | 0;
		var xMax = pCoords[0] + r +1 | 0;
		var yMin = pCoords[1] - r | 0;
		var yMax = pCoords[1] + r +1 | 0;
		xMin = xMin < 0 ? 0 : xMin > w-1 ? w-1 : xMin;
		xMax = xMax < 0 ? 0 : xMax > w-1 ? w-1 : xMax;
		yMin = yMin < 0 ? 0 : yMin > h-1 ? h-1 : yMin;
		yMax = yMax < 0 ? 0 : yMax > h-1 ? h-1 : yMax;


		var dR = 5*p.m;
		var dG = 5*p.m;
		var dB = 5*p.m;

		for(var y = yMin; y <= yMax; y++){
			for(var x = xMin; x <= xMax; x++){
				if(Math.pow(x-pCoords[0],2)+Math.pow(y-pCoords[1],2) < r2){
					var index = 4*(w*y+x);
					src[index  ] += dR;
					src[index+1] += dG;
					src[index+2] += dB;
					src[index+3] = 255;
				}
			}
		}
	}

	ctx.putImageData(newData,gameBoxTL[0],gameBoxTL[1]);
	ctx.restore();
};

GTE.drawLevel = function(){
	//GTE.drawDensity();
	//return;

	var ctx = GTE.ctx;
	// ctx.save();

	// ctx.fillStyle =  'rgb(0,0,200)';
	// ctx.strokeStyle = 'rgb(0,0,0)';
	// ctx.lineWidth = 1;

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		var canvasCoord = GTE.gameInternalToRenderSpace(p.x,p.y);

		var radius = p.r * GTE.getRenderBoxWidth() / 2;

		if(typeof GTE.pCanvases[p.id] !== 'object'){
			// GTE.dirtyBG = false;
			p.canvas = 1;
			GTE.pCanvases[p.id] = document.createElement('canvas');
			GTE.pCanvases[p.id].width  = Math.ceil(2*radius);
			GTE.pCanvases[p.id].height = Math.ceil(2*radius);
			GTE.drawParticle(GTE.pCanvases[p.id],p,radius);
		}

		ctx.drawImage(GTE.pCanvases[p.id],canvasCoord[0]-radius,canvasCoord[1]-radius);
		
		// var color = [0,0,200];
		// if(p.m < 0){
		// 	color = [200,0,0];
		// }

		// var colorStr = GTE.arrayColorToString(color);
		// ctx.fillStyle = colorStr;

		// var absMass = Math.abs(p.m);
		// var discLevel = 0;

		// while(absMass > 0){
		// 	var drawMass = absMass >= 1 ? 1 : absMass;
		// 	absMass -= drawMass;

		// 	var discX = canvasCoord[0]-(Math.log(Math.E*(discLevel+1))-1)*5;
		// 	var discY = canvasCoord[1]-(Math.log(Math.E*(discLevel+1))-1)*5;

		// 	//Fill arc
		// 	ctx.beginPath();
		// 	if(discLevel == 0){
		// 		ctx.arc(discX, discY, radius, 0, 2 * Math.PI, false);
		// 	}else{
		// 		ctx.arc(discX, discY, radius * Math.sqrt(drawMass), 0, 2 * Math.PI, false);
		// 	}
		// 	ctx.closePath();
		// 	ctx.stroke();

		// 	//Storke arc
		// 	ctx.beginPath();
		// 		ctx.arc(discX, discY, radius * Math.sqrt(drawMass), 0, 2 * Math.PI, false);
		// 	ctx.closePath();
		// 	ctx.fill();

		// 	discLevel++;
		// }

		// if(Math.abs(p.m) > 1){

		// 	ctx.fillStyle = 'rgb(255,255,255)';
		// 	ctx.textAlign = 'center';
		// 	ctx.textBaseline = 'middle';

		// 	var drawStr = p.m;
		// 	if(Math.abs(p.m - (p.m|0)) > 0){
		// 		drawStr = p.m.toPrecision(3);
		// 		radius *= 0.7;
		// 	}

		// 	var height = radius + 0.5 | 0;
		// 	ctx.font = height + "px Verdana";

		// 	ctx.strokeText(drawStr,discX,discY);
		// 	ctx.fillText(drawStr,discX,discY);
		// }
		
	}


	// //Test multiply view
	// var pA = GTE.levelState.particles[0];
	// var pB = GTE.levelState.particles[1];

	// var vecP = [];
	// vecP[0] = (pB.x - pA.x);
	// vecP[1] = (pB.y - pA.y);
	// var dist = Math.sqrt(vecP[0]*vecP[0] + vecP[1]+vecP[1]);

	// var vecN = [];
	// vecN[0] = -vecP[1];
	// vecN[1] =  vecP[0];

	// var coordsA = GTE.gameInternalToRenderSpace(pA.x,pA.y);
	// var coordsB = GTE.gameInternalToRenderSpace(pB.x,pB.y);
	
	// var height = 50;
	// ctx.fillStyle = 'rgba(255,255,255,0.8)'
	// ctx.moveTo(coordsA[0]-height,coordsA[1]-height);
	// ctx.lineTo(coordsA[0],coordsA[1]);
	// ctx.lineTo(coordsB[0],coordsB[1]);
	// ctx.lineTo(coordsB[0]-height,coordsB[1]-height);

	// ctx.fill();

	// ctx.restore();
};

GTE.drawBackground = function(endStage){
	var ctx = GTE.ctx;
	ctx.save();

	ctx.clearRect(0,0,GTE.canvas.width,GTE.canvas.height);

	// var grd;

	// var redLeft  = 128-(GTE.levelState.temperatureLeft  * 3).toFixed(0);
	// var redRight = 128-(GTE.levelState.temperatureRight * 3).toFixed(0);

	// if(isNaN(redLeft)){redLeft = 0;}
	// if(isNaN(redRight)){redRight = 0;}

	// redLeft  = redLeft  < 0 ? 0 : redLeft  > 255 ? 255 : redLeft;
	// redRight = redRight < 0 ? 0 : redRight > 255 ? 255 : redRight;

	if(GTE.dirtyBG){
		GTE.dirtyBG = false;
		GTE.bgCanvas = document.createElement('canvas');
		GTE.bgCanvas.width  = GTE.getRenderBoxWidth();
		GTE.bgCanvas.height = GTE.getRenderBoxHeight();
		GTE.drawBackgroundBasedOnLevel(GTE.bgCanvas);
	}

	ctx.drawImage(GTE.bgCanvas,GTE.renderBox[0],GTE.renderBox[1]);

	// GTE.canvas = bgCanvas;
	// }

	// grd = ctx.createLinearGradient(GTE.renderBox[0],GTE.renderBox[1],GTE.getRenderBoxWidth(),GTE.getRenderBoxHeight()/2);
	// grd.addColorStop(0,'rgb(' + redLeft + ',215,236)');
	// grd.addColorStop(1,'rgb(' + redRight + ',141,178)');

	// ctx.fillStyle = grd;

	//Box border
    // ctx.strokeStyle = '000';
    // ctx.lineWidth = 3;
    // ctx.stroke();
	// ctx.fill();

	var w = GTE.getRenderBoxWidth();
	var h = GTE.getRenderBoxHeight();


	ctx.beginPath();
	if(endStage){
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		//Check mark
		if(GTE.lastWon){
			ctx.strokeStyle = GTE.colorToStr(GTE.colors.winColor,0.9);
			ctx.moveTo(GTE.renderBox[0]+Math.max(0.1,(0.50-0.15*GTE.getYScale()))*w,GTE.renderBox[1]+(0.60+0.05*GTE.getYScale())*h);
			ctx.lineTo(GTE.renderBox[0]+0.50*w,GTE.renderBox[1]+0.95*h);
			ctx.lineTo(GTE.renderBox[0]+0.90*w,GTE.renderBox[1]+0.05*h);
			ctx.stroke();
		}else{
			// X mark
			ctx.strokeStyle = GTE.colorToStr(GTE.colors.loseColor,0.6);
			ctx.moveTo(GTE.renderBox[0]+0.10*w,GTE.renderBox[1]+0.1*h);
			ctx.lineTo(GTE.renderBox[0]+0.90*w,GTE.renderBox[1]+0.9*h);
			ctx.moveTo(GTE.renderBox[0]+0.10*w,GTE.renderBox[1]+0.9*h);
			ctx.lineTo(GTE.renderBox[0]+0.90*w,GTE.renderBox[1]+0.1*h);
			ctx.stroke();
		}

		var x1 =  GTE.renderBox[0];
		var x2 =  GTE.renderBox[2];
		ctx.beginPath();
		ctx.moveTo(x1-0.5,GTE.renderBox[1]-0.5);
		ctx.lineTo(x1-0.5,GTE.renderBox[3]+0.5);
		ctx.lineTo(x2+0.5,GTE.renderBox[3]+0.5);
		ctx.lineTo(x2+0.5,GTE.renderBox[1]-0.5);
		ctx.lineTo(x1-0.5,GTE.renderBox[1]-0.5);
		ctx.lineWidth = 3;
		ctx.stroke();
	}


	// var x1 = (GTE.renderBox[0]+GTE.renderBox[2])/2 + GTE.renderBoxGap/2;
	// var x2 = GTE.renderBox[2];
	// ctx.beginPath();
 //    ctx.moveTo(x1-0.5,GTE.renderBox[1]-0.5);
 //    ctx.lineTo(x1-0.5,GTE.renderBox[3]+0.5);
 //    ctx.lineTo(x2+0.5,GTE.renderBox[3]+0.5);
 //    ctx.lineTo(x2+0.5,GTE.renderBox[1]-0.5);
 //    ctx.lineTo(x1-0.5,GTE.renderBox[1]-0.5);
 //    ctx.strokeStyle = '000';
 //    ctx.lineWidth = 3;
 //    ctx.stroke();
	// // ctx.fill();

    ctx.restore();
};

GTE.drawMidline = function(alpha){
	// console.log(alpha);
	if(typeof alpha !== 'number'){alpha = 1;}
	var ctx = GTE.ctx;
	ctx.save();

	alpha *= 0.3;

	var midX = (GTE.renderBox[0] + GTE.renderBox[2])/2+0.5|0;
	var x = midX+0.5;
	var y1 = GTE.renderBox[1] - 0.5;
	var y2 = GTE.renderBox[3] + 0.5;
	
	ctx.lineWidth = 3;
	
	ctx.strokeStyle = 'rgba(0,0,0,'+alpha.toFixed(2)+')';
	if(GTE.levelSettings.transfer){

		var n = 51;
		ctx.beginPath();

		var yLast = y1;
		var dy = (y2-y1)/n;
		var yGoal,yActual;
		for(var i = 0; i <= n; i++){

			yGoal = y1+i*dy;
			yActual = (yGoal|0)+0.5;

			if(i%2 == 0){
				ctx.moveTo(x,yActual);
			}else{
				ctx.lineTo(x,yActual);
			}

			yLast = yActual;
		}

		ctx.closePath();
		ctx.stroke();
	}else{

		// return; //tmp disable solid line
		ctx.beginPath();
		ctx.moveTo(x,y1);
		ctx.lineTo(x,y2);
		ctx.closePath();
		ctx.stroke();
	}


    ctx.restore();
};

GTE.newLevelAnimation = function(time){
	var ctx = GTE.ctx;
	ctx.save();

	if(GTE.lastWon){
		ctx.fillStyle = 'rgba(0,150,0,'+(1-time/GTE.newStageAnimationTime)+')';
	}else{
		ctx.fillStyle = 'rgba(150,0,0,'+(1-time/GTE.newStageAnimationTime)+')';
	}

	//Box border
	ctx.beginPath();
    ctx.moveTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
    ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[3]+0.5);
    ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[3]+0.5);
    ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[1]-0.5);
    ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
    ctx.closePath();
    // ctx.fill();

    ctx.restore();
};