GTE.drawGame = function(){
	GTE.drawBackground();
	GTE.drawMidline();
	GTE.drawLevel();
	GTE.drawMouseForces();
	GTE.drawButtons();
};

GTE.drawMouseForces = function(){

	var ctx = GTE.ctx;
	ctx.save();

	for(var forceID = 0; forceID < 10; forceID++){
		var f = GTE.levelState.mouseForces[forceID];
		if(typeof f !== 'object'){continue;}
		var p = GTE.levelState.particles[f.pID];
		if(typeof p !== 'object'){continue;}

		var canvasCoordP = GTE.internalToRenderSpace(p.x,p.y);
		var canvasCoordF = GTE.internalToRenderSpace(f.fX,f.fY);

		ctx.beginPath();
	    ctx.moveTo(canvasCoordF[0], canvasCoordF[1]);
	    ctx.lineTo(canvasCoordP[0], canvasCoordP[1]);
	    ctx.strokeStyle = '800';
	    ctx.lineWidth = 3;
	    ctx.stroke();
	}
	ctx.restore();
};

GTE.drawLevel = function(){
	var ctx = GTE.ctx;
	ctx.save();

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		var canvasCoord = GTE.internalToRenderSpace(p.x,p.y);

		var radius = p.r * GTE.getRenderBoxHeight();
		
		var color = [0,0,255];
		var colorStr = GTE.arrayColorToString(color);

		ctx.beginPath();
		ctx.arc(canvasCoord[0], canvasCoord[1], radius, 0, 2 * Math.PI, false);
		ctx.closePath();

		ctx.fillStyle = colorStr;
		ctx.fill();
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

		ctx.beginPath();
	    ctx.moveTo(canvasCoordTL[0]+0.5,canvasCoordTL[1]+0.5);
	    ctx.lineTo(canvasCoordBR[0]+0.5,canvasCoordTL[1]+0.5);
	    ctx.lineTo(canvasCoordBR[0]+0.5,canvasCoordBR[1]+0.5);
	    ctx.lineTo(canvasCoordTL[0]+0.5,canvasCoordBR[1]+0.5);
	    ctx.lineTo(canvasCoordTL[0]+0.5,canvasCoordTL[1]+0.5);
	    ctx.closePath();
	    ctx.strokeStyle = '000';
	    ctx.fillStyle  = 'rgba(0,0,0,0.3)';
	    ctx.lineWidth = 3;
	    ctx.stroke();
	    ctx.fill();
	}

    ctx.restore();
};

GTE.drawMidline = function(){
	var ctx = GTE.ctx;
	ctx.save();

	var midX = (GTE.renderBox[0] + GTE.renderBox[2])/2+0.5|0;

	ctx.beginPath();
    ctx.moveTo(midX+0.5,GTE.renderBox[1]-0.5);
    ctx.lineTo(midX+0.5,GTE.renderBox[3]+0.5);

    ctx.closePath();
    ctx.strokeStyle = '000';
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
	var firstRender = true;
	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		
		if(p.iE >= 0){
			firstRender = false;
		}else{
			p.iE = -1;
		}

		if(p.x < 1){
			sumL+=p.m;
		}else{
			sumR+=p.m;
		}
	}

	var x1 = GTE.renderBox[0] +   (GTE.renderBox[2] - GTE.renderBox[0])/4;
	var x2 = GTE.renderBox[0] + 3*(GTE.renderBox[2] - GTE.renderBox[0])/4;
	var y1 = GTE.renderBox[1] +   (GTE.renderBox[3] - GTE.renderBox[1])/2;
	var y2 = GTE.renderBox[1] +   (GTE.renderBox[3] - GTE.renderBox[1])/2;
    
    ctx.fillStyle = 'rgb(255,255,255)';
    ctx.font = "72px Verdana";
    ctx.fillText(sumL,x1,y1);
    ctx.fillText(sumR,x2,y2);

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
    var goals = [
    				[{x:0.5,y:0.5}],
    				[{x:0.5,y:0.5}], //
    				[{x:0.4,y:0.5},{x:0.6,y:0.5}],
    				[{x:0.4,y:0.6},{x:0.6,y:0.6},{x:0.5,y:0.4}]
    			];
	var cL,cR;
    if(sumL < goals.length){
    	cL = goals[sumL];
    }else{
    	cL = [];
		for(var i = 0; i < sumL; i++){
			var r = 0.3;
			var angle = i / sumL * 2 * Math.PI;
			cL[i] = {
				x:0.5+r*Math.cos(angle),
				y:0.5+r*Math.sin(angle)
			}
		}
    }

    if(sumR < goals.length){
    	cR = goals[sumR];
    }else{
    	cR = [];
		for(var i = 0; i < sumR; i++){
			var r = 0.3;
			var angle = i / sumR * 2 * Math.PI;
			cR[i] = {
				x:0.5+r*Math.cos(angle),
				y:0.5+r*Math.sin(angle)
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
	    	var bestI = -1;
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

			if(bestI >= 0){
				GTE.levelState.particles[bestI].iE = j;
			}
	    }

	    for(var j = 0; j < cR.length; j++){
	    	var c = cR[j];
	    	var best = 100;
	    	var bestI = -1;
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
			if(bestI >= 0){
				GTE.levelState.particles[bestI].iE = j;
			}
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