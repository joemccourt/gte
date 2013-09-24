GTE.drawGame = function(){

	if(GTE.boardGameView){
		GTE.drawBoardGame();
	}else{
		GTE.drawBackground();
		GTE.drawMidline();
		GTE.drawLevel();
		GTE.drawMouseForces();
		GTE.drawButtons();
	}
};

GTE.drawStar = function(ctx, x,y,r){
	ctx.beginPath();

	var angle = 18*Math.PI/180;
	ctx.moveTo(x + r*Math.cos(angle), y - r*Math.sin(angle));
	angle = 162*Math.PI/180;
	ctx.lineTo(x + r*Math.cos(angle), y - r*Math.sin(angle));
	angle = 306*Math.PI/180;
	ctx.lineTo(x + r*Math.cos(angle), y - r*Math.sin(angle));
	angle = 90*Math.PI/180;
	ctx.lineTo(x + r*Math.cos(angle), y - r*Math.sin(angle));
	angle = 234*Math.PI/180;
	ctx.lineTo(x + r*Math.cos(angle), y - r*Math.sin(angle));

	// ctx.arc(x, y, r, 0, 2 * Math.PI, false);
	ctx.closePath();
};

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

	var offX = w*GTE.drawBoardGameTransform[3];
	var offY = h*GTE.drawBoardGameTransform[7];

	ctx.transform(1,0,0,1,offX,offY);

	var grd;
	grd = ctx.createLinearGradient(GTE.renderBox[0],GTE.renderBox[1],w,h/2);
	grd.addColorStop(0, 'rgb(255,198,198)');
	grd.addColorStop(0.5, 'rgb(255,226,222)');
	grd.addColorStop(1, 'rgb(109,216,230)');

	ctx.fillStyle = grd;
	var boardWidth  = w*(gameBox[2]-gameBox[0]);
	var boardHeight = h*(gameBox[3]-gameBox[1]);
	var boardStartX = GTE.renderBox[0]+gameBox[0]*w;
	var boardStartY = GTE.renderBox[1]+gameBox[1]*h;
	ctx.fillRect(boardStartX,boardStartY,boardWidth,boardHeight);

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

			// ctx.moveTo((i0x+i1x)/2,(i0y+i1y)/2);
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
				if(lastStars != null){
					stars = 0;
				}else{
					stars = -1;
				}
			}else{
				stars = 0;
			}
		}

	
		if(stars > 0){
			ctx.fillStyle = '#4e8';
		}else if(stars == 0){
			ctx.fillStyle = '#44e';
		}else{
			ctx.fillStyle = '#ddd';
		}

		var x = x1+coords[i][0]*w;
		var y = y1+coords[i][1]*h;

		ctx.strokeStyle = 'rgba(0,0,0,0.6)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();


		ctx.font = "" + (r) + "px Verdana";

		ctx.textAlign = 'center';
		ctx.textBaseline = 'baseline';
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.fillText(""+i,x+1.3*r,y+1.3*r);

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
			ctx.fillStyle = 'rgb(150,90,56)';
			ctx.strokeStyle = 'rgba(0,0,0,0.3)';
			ctx.lineWidth = 2;
			var angle = 130 * Math.PI/180;
			GTE.drawStar(ctx, x+rStar*Math.cos(angle), y-rStar*Math.sin(angle), r*0.45);
			ctx.stroke();
			ctx.fill();
		}

		if(stars > 1){
			ctx.fillStyle = 'rgb(204,194,194)';
			ctx.strokeStyle = 'rgba(0,0,0,0.3)';
			var angle = 90 * Math.PI/180;
			GTE.drawStar(ctx, x+rStar*Math.cos(angle), y-rStar*Math.sin(angle), r*0.45);
			ctx.stroke(	);
			ctx.fill();
		}

		if(stars > 2){
			ctx.fillStyle = 'rgb(217,164,65)';
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

GTE.drawMouseForces = function(){

	var ctx = GTE.ctx;
	ctx.save();

	for(var forceID = 0; forceID < 10; forceID++){
		var f = GTE.levelState.mouseForces[forceID];
		if(typeof f !== 'object'){continue;}

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

		ctx.beginPath();
	    ctx.moveTo(canvasCoordF[0], canvasCoordF[1]);
	    ctx.lineTo(canvasCoordP[0], canvasCoordP[1]);
	    ctx.strokeStyle = '800';
	    ctx.lineWidth = 3;
	    ctx.stroke();
	}
	ctx.restore();
};

GTE.sign = function(x){return x < 0 ? -1 : x > 0 ? 1 : 0;}

GTE.drawLevel = function(){
	var ctx = GTE.ctx;
	ctx.save();

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		var canvasCoord = GTE.gameInternalToRenderSpace(p.x,p.y);

		var radius = p.r * GTE.getRenderBoxWidth() / 2;
		
		var color = [0,0,200];
		if(p.m < 0){
			color = [200,0,0];
		}

		var colorStr = GTE.arrayColorToString(color);

		var absMass = Math.abs(p.m);
		var discLevel = 0;

		while(absMass > 0){
			var drawMass = absMass >= 1 ? 1 : absMass;
			absMass -= drawMass;

			var discX = canvasCoord[0]-(Math.log(Math.E*(discLevel+1))-1)*5;
			var discY = canvasCoord[1]-(Math.log(Math.E*(discLevel+1))-1)*5;

			ctx.beginPath();
			ctx.arc(discX, discY, radius * Math.sqrt(drawMass), 0, 2 * Math.PI, false);
			ctx.closePath();

			ctx.fillStyle = colorStr;

			if(discLevel > 0){
				// ctx.shadowColor = 'rgba(0,0,0,0.25)';
				ctx.shadowBlur = 10;
				ctx.shadowOffsetX = 3;
				ctx.shadowOffsetY = 3;
				
				if(drawMass < 1){
					// ctx.shadowColor = 'rgba(0,0,0,0.75)';
				}
			}


			ctx.fill();

			//Surrounding circle
			// ctx.shadowColor = 'rgba(0,0,0,0)';
			ctx.fillStyle = 'rgb(0,0,0)';

			ctx.beginPath();
			if(discLevel == 0){
				ctx.arc(discX, discY, radius, 0, 2 * Math.PI, false);
			}else{
				ctx.arc(discX, discY, radius * Math.sqrt(drawMass), 0, 2 * Math.PI, false);
			}
			ctx.closePath();

			if(!GTE.levelSettings.annihilate){
				ctx.lineWidth = 1;
			}else{
				ctx.lineWidth = 1;	
			}
			
			ctx.stroke();

			discLevel++;
		}

	}

	ctx.restore();
};

GTE.drawBackground = function(){
	var ctx = GTE.ctx;
	ctx.save();

	ctx.clearRect(0,0,GTE.canvas.width,GTE.canvas.height);

	var grd;

	grd = ctx.createLinearGradient(GTE.renderBox[0],GTE.renderBox[1],GTE.getRenderBoxWidth(),GTE.getRenderBoxHeight()/2);
	grd.addColorStop(0, 'rgb(149,215,236)');
	grd.addColorStop(1, 'rgb(29,141,178)');

	ctx.fillStyle = grd;
	ctx.fillRect(GTE.renderBox[0],GTE.renderBox[1],GTE.getRenderBoxWidth(),GTE.getRenderBoxHeight());		

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


GTE.drawButtons = function(){
	var ctx = GTE.ctx;
	ctx.save();

	for(var i = 0; i < GTE.buttons.length; i++){
		var button = GTE.buttons[i];
		
		var canvasCoordTL = GTE.internalToRenderSpace(button.box[0],button.box[1]);
		var canvasCoordBR = GTE.internalToRenderSpace(button.box[2],button.box[3]);

		var x1 = canvasCoordTL[0]+0.5;
		var y1 = canvasCoordTL[1]+0.5;
		var x2 = canvasCoordBR[0]+0.5;
		var y2 = canvasCoordBR[1]+0.5;

		var r = 0.25 * (y2 - y1);

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

	    ctx.strokeStyle  = 'rgba(0,0,0,0.8)';
	    ctx.fillStyle  = 'rgba(0,0,0,0.3)';
	    ctx.lineWidth = 2;
	    ctx.stroke();
	    ctx.fill();


		ctx.fillStyle = 'rgb(255,255,255)';
		var height = 32*(GTE.getRenderBoxWidth()+GTE.getRenderBoxHeight())/2000;
		ctx.font = height + "px Verdana";

		ctx.textAlign = 'center';
		ctx.textBaseline = 'baseline';

	    ctx.fillText('GTE',(x1+x2)/2,y1 + height*1.5);
	}

    ctx.restore();
};

GTE.drawMidline = function(){
	var ctx = GTE.ctx;
	ctx.save();

	var midX = (GTE.renderBox[0] + GTE.renderBox[2])/2+0.5|0;

	if(GTE.levelSettings.transfer){
		ctx.strokeStyle = 'rgba(0,0,0,0.5)';
	}else{
		ctx.strokeStyle = '000';
	}

	ctx.beginPath();
	ctx.moveTo(midX+0.5,GTE.renderBox[1]-0.5);
	ctx.lineTo(midX+0.5,GTE.renderBox[3]+0.5);
	ctx.closePath();
	ctx.lineWidth = 3;
	ctx.stroke();

    ctx.restore();
};

GTE.newLevelAnimation = function(time){
	var ctx = GTE.ctx;
	ctx.save();

	if(GTE.lastWon){
		ctx.fillStyle = 'rgba(0,150,0,'+(1-time/GTE.newLevelAnimationTime)+')';
	}else{
		ctx.fillStyle = 'rgba(150,0,0,'+(1-time/GTE.newLevelAnimationTime)+')';
	}

	//Box border
	ctx.beginPath();
    ctx.moveTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
    ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[3]+0.5);
    ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[3]+0.5);
    ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[1]-0.5);
    ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
};

GTE.endLevelAnimation = function(time){
	var ctx = GTE.ctx;
	ctx.save();

	var sumL = 0;
	var sumR = 0;
	var sumLAbs = 0;
	var sumRAbs = 0;
	var firstRender = true;
	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		
		if(p.iE >= 0){
			firstRender = false;
		}else{
			p.iE = -1;
		}

		if(p.x < 1){
			sumLAbs++;
			sumL+=p.m;
		}else{
			sumRAbs++;
			sumR+=p.m;
		}
	}

	var x1 = GTE.renderBox[0] +   (GTE.renderBox[2] - GTE.renderBox[0])/4;
	var x2 = GTE.renderBox[0] + 3*(GTE.renderBox[2] - GTE.renderBox[0])/4;
	var y1 = GTE.renderBox[1] +   (GTE.renderBox[3] - GTE.renderBox[1])/2;
	var y2 = GTE.renderBox[1] +   (GTE.renderBox[3] - GTE.renderBox[1])/2;

	ctx.fillStyle = 'rgb(255,255,255)';
	ctx.font = 72*GTE.getRenderBoxWidth()/600 + "px Verdana";

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	var leftFormat, rightFormat;

	if(Math.abs(sumL - Math.round(sumL)) <= 0.005){
		leftFormat = Math.round(sumL);
	}else{
		leftFormat = sumL.toFixed(2);
	}

	if(Math.abs(sumR - Math.round(sumR)) <= 0.005){
		rightFormat = Math.round(sumR);
	}else{
		rightFormat = sumR.toFixed(2);
	}

	var centerText;
	if(sumL > sumR){
		centerText = ">";
	}else if(sumL < sumR){
		centerText = "<";
	}else{
		centerText = "=";
	}

	ctx.fillText(centerText,(x1+x2)/2,y1);
	ctx.fillText(leftFormat,x1,y1);
	ctx.fillText(rightFormat,x2,y2);

	//Right side
	if(sumL >= sumR){
		ctx.fillStyle = 'rgba(0,150,0,'+(time/GTE.endLevelAnimationTime)+')';
	}else{
		ctx.fillStyle = 'rgba(150,0,0,'+(time/GTE.endLevelAnimationTime)+')';
	}

	var xMid = GTE.renderBox[0] + (GTE.renderBox[2] - GTE.renderBox[0])/2;
	ctx.beginPath();
    ctx.moveTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
    ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[3]+0.5);
    ctx.lineTo(xMid,GTE.renderBox[3]+0.5);
    ctx.lineTo(xMid,GTE.renderBox[1]-0.5);
    ctx.lineTo(GTE.renderBox[0]-0.5,GTE.renderBox[1]-0.5);
    ctx.closePath();
    ctx.fill();

    var yScale = GTE.getYScale();

    //Right side box
	if(sumR >= sumL){
		ctx.fillStyle = 'rgba(0,150,0,'+(time/GTE.endLevelAnimationTime)+')';
	}else{
		ctx.fillStyle = 'rgba(150,0,0,'+(time/GTE.endLevelAnimationTime)+')';
	}

	var xMid = GTE.renderBox[0] + (GTE.renderBox[2] - GTE.renderBox[0])/2;
	ctx.beginPath();
    ctx.moveTo(xMid,GTE.renderBox[1]-0.5);
    ctx.lineTo(xMid,GTE.renderBox[3]+0.5);
    ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[3]+0.5);
    ctx.lineTo(GTE.renderBox[2]+0.5,GTE.renderBox[1]-0.5);
    ctx.lineTo(xMid,GTE.renderBox[1]-0.5);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    var dT = time/GTE.endLevelAnimationTime;

    //Special cases for 1 and 2 for now
    var goals = [
    				[{x:0.5,y:0.6}],
    				[{x:0.5,y:0.65}], //
    				[{x:0.4,y:0.5},{x:0.6,y:0.5}]
    			];

	var cL,cR,r;
	r = 0.15 * Math.sqrt(sumLAbs/3);
	r = r > 0.45 ? r = 0.45 : r;
    cL = [];
    if(sumLAbs > 0 && sumLAbs <= 2){
    	cL = goals[sumLAbs];
    }else{
		for(var i = 0; i < sumLAbs; i++){
			var angle = i / sumLAbs * 2 * Math.PI - Math.PI/2; //One always on top
			cL[i] = {
				x:0.5+r*Math.cos(angle),
				y:0.5*yScale+r*Math.sin(angle)
			}
		}
    }

	r = 0.15 * Math.sqrt(sumRAbs/3);
	r = r > 0.45 ? r = 0.45 : r;
    cR = [];
    if(sumRAbs > 0 && sumRAbs <= 2){
    	cR = goals[sumRAbs];
    }else{
		for(var i = 0; i < sumRAbs; i++){
			var angle = i / sumRAbs * 2 * Math.PI - Math.PI/2; //One always on top
			cR[i] = {
				x:0.5+r*Math.cos(angle),
				y:0.5*yScale+r*Math.sin(angle)
			}
		}
    }


	//Find closest particles
	if(firstRender){
	    var iL = 0;
	    var iR = 0;
	    for(var j = 0; j < cL.length; j++){
	    	var c = cL[j];
	    	var best = 100;
	    	var bestI = 0;
		  	for(var i = 0; i < GTE.levelState.particles.length; i++){
				var p = GTE.levelState.particles[i];
				if(p.x < 1){
					var r = Math.sqrt(Math.pow(p.x-c.x,2)+Math.pow(p.y-c.y,2));
					if(r < best && p.iE < 0){	
						best = r;
						bestI = i;
					}
				}
			}

			GTE.levelState.particles[bestI].iE = j;
	    }

	    for(var j = 0; j < cR.length; j++){
	    	var c = cR[j];
	    	var best = 100;
	    	var bestI = 0;
		  	for(var i = 0; i < GTE.levelState.particles.length; i++){
				var p = GTE.levelState.particles[i];
				if(p.x >= 1){
					var r = Math.sqrt(Math.pow(p.x-c.x,2)+Math.pow(p.y-c.y,2));
					if(r < best && p.iE < 0){
						best = r;
						bestI = i;
					}
				}
			}
			GTE.levelState.particles[bestI].iE = j;
	    }
	}

    var v = 200 / GTE.endLevelAnimationTime;
    for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		if(p.x < 1){
			var c = cL[p.iE];
			var r = Math.sqrt(Math.pow(p.x-c.x,2)+Math.pow(p.y-c.y,2));
			p.x += v * (c.x - p.x);
			p.y += v * (c.y - p.y);
		}else{
			var c = cR[p.iE];
			var r = Math.sqrt(Math.pow(p.x-c.x-1,2)+Math.pow(p.y-c.y,2));
			p.x += v * (c.x+1 - p.x);
			p.y += v * (c.y - p.y);
		}
	}
};

GTE.updateUI = function(){
	$('#renderTime').text("Frame Render Time: "+(GTE.frameRenderTime+0.5|0)+"ms");
};

GTE.updateHUD = function(){
	var outText = "";
	outText += "Level: " + GTE.level + " ";
	outText += "Stage: " + GTE.stage + "/" + GTE.levelSettings['rounds'] + " ";
	outText += "Record: " +  GTE.stagesWon + "-" + GTE.stagesLost + " ";

	if(GTE.stagesWon < GTE.levelSettings['starReqs'][0]){
		outText += "(need " + (GTE.levelSettings['starReqs'][0] - GTE.stagesWon)+ " more to pass)" + " ";
	}else if(GTE.stagesWon < GTE.levelSettings['starReqs'][1]){
		outText += "(need " + (GTE.levelSettings['starReqs'][1] - GTE.stagesWon)+ " more to get two stars)" + " ";
	}else if(GTE.stagesWon < GTE.levelSettings['starReqs'][2]){
		outText += "(need " + (GTE.levelSettings['starReqs'][2] - GTE.stagesWon)+ " more to get three stars)" + " ";
	}

	$('#hud').text(outText);
};

