"use strict";

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

GTE.drawLevel = function(){
	var ctx = GTE.ctx;

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		var canvasCoord = GTE.gameInternalToRenderSpace(p.x,p.y);

		var radius = p.r * GTE.getRenderBoxWidth() / 2;

		if(typeof GTE.pCanvases[p.id] !== 'object'){

			p.canvas = 1;
			GTE.pCanvases[p.id] = document.createElement('canvas');
			GTE.pCanvases[p.id].width  = Math.ceil(2*radius);
			GTE.pCanvases[p.id].height = Math.ceil(2*radius);
			GTE.drawParticle(GTE.pCanvases[p.id],p,radius);
		}

		ctx.drawImage(GTE.pCanvases[p.id],canvasCoord[0]-radius,canvasCoord[1]-radius);
	}
};

GTE.drawBackground = function(endStage){
	var w = GTE.getRenderBoxWidth();
	var h = GTE.getRenderBoxHeight();

	var ctx = GTE.ctx;
	ctx.save();

	ctx.clearRect(0,0,GTE.canvas.width,GTE.canvas.height);

	if(GTE.dirtyBG){
		GTE.dirtyBG = false;
		GTE.bgCanvas = document.createElement('canvas');
		GTE.bgCanvas.width  = GTE.getRenderBoxWidth();
		GTE.bgCanvas.height = GTE.getRenderBoxHeight();
		GTE.drawBackgroundBasedOnLevel(GTE.bgCanvas);
	}

	ctx.drawImage(GTE.bgCanvas,GTE.renderBox[0],GTE.renderBox[1]);

	ctx.beginPath();

	if(endStage){
		ctx.lineWidth = 5;
		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

		// Check mark or 'X'
		if(GTE.lastWon){
			ctx.strokeStyle = GTE.colorToStr(GTE.colors.winColor,0.9);
			ctx.moveTo(GTE.renderBox[0]+Math.max(0.1,(0.50-0.15*GTE.getYScale()))*w,GTE.renderBox[1]+(0.60+0.05*GTE.getYScale())*h);
			ctx.lineTo(GTE.renderBox[0]+0.50*w,GTE.renderBox[1]+0.95*h);
			ctx.lineTo(GTE.renderBox[0]+0.90*w,GTE.renderBox[1]+0.05*h);
			ctx.stroke();
		}else{
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

    ctx.restore();
};

GTE.drawMidline = function(alpha){

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
		ctx.beginPath();
		ctx.moveTo(x,y1);
		ctx.lineTo(x,y2);
		ctx.closePath();
		ctx.stroke();
	}

    ctx.restore();
};