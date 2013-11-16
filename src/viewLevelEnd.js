"use strict";

GTE.drawEndGoals = function(goals){
	var ctx = GTE.ctx;
	ctx.save();

	ctx.fillStyle = 'rgba(0,0,200,0.2)';
	for(var i = 0; i < goals.length; i++){
		ctx.beginPath();

		var coords = GTE.gameInternalToRenderSpace(goals[i].x,goals[i].y);

		ctx.arc(coords[0], coords[1], 10, 0, 2 * Math.PI, false);
		ctx.fill();
	}

	ctx.restore();
};

GTE.formatPrimeFactors = function(factors){
	var str = "";
	var count = 0;
	for(var f in factors){
		if(factors.hasOwnProperty(f)){
			for(var i = 0; i < factors[f]; i++){
				if(count == 0){
					str = f+str;
				}else{
					str = f+"x"+str;
				}
				count++;
			}
		}
	}

	if(count == 1){
		str = "prime";
	}
	return str;
}

GTE.getEndGoalsFactors = function(num,side){
    var yScale = GTE.getYScale();
	
	var pR = 0.05;
	var goals = [];

	var p0 = GTE.levelState.particles[0];
	if(typeof p0 === 'object'){
		pR = p0.r;
	}

	var r = 0.33;

	var center = 
	{
		x:0.5,
		y:0.5 * yScale
	};

	if(side == 'right'){
		center.x += 1;
	}

	function setGoals(goals,center,num,r,a0){

		if(num == 1){
			goals.push(center);
			return;
		}

		var factors = GTE.getPrimeFactors(num);

		var maxFactor = 1;
		for(var k in factors){
			if(factors.hasOwnProperty(k)){
				if(k > maxFactor){
					maxFactor = k;
				}
			}
		}

		if(maxFactor == 1){return;}
		if(maxFactor == 2 && factors[2] >= 2){maxFactor = 4;}

		for(var i = 0; i < maxFactor; i++){
			var a = 2*Math.PI*(i)/maxFactor+a0;
			if(maxFactor % 2 == 0 && maxFactor != 2){
				a += 2*Math.PI*0.5/maxFactor;
			}

			var newCenter = 
			{
				x:center.x+r*Math.cos(a),
				y:center.y+r*Math.sin(a)
			};

			setGoals(goals,newCenter,num/maxFactor,r/maxFactor,a);
		}
	}

	if(yScale < 1){r = r*yScale;}
	setGoals(goals,center,num,r,-Math.PI/2);

    return goals
};

GTE.endLevelAnimation = function(time){
	
	var timeWidth = GTE.endStageAnimationTime;
	time = time < 0 ? 0 : time > timeWidth ? timeWidth : time;

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
			if(p.m > 0){
				sumLAbs++;
			}else{
				sumRAbs++;
			}
			sumL+=p.m;
		}else{
			if(p.m > 0){
				sumRAbs++;	
			}else{
				sumLAbs++;
			}
			sumR+=p.m;
		}
	}

	var x1 = GTE.renderBox[0] +   (GTE.renderBox[2] - GTE.renderBox[0])/4;
	var x2 = GTE.renderBox[0] + 3*(GTE.renderBox[2] - GTE.renderBox[0])/4;
	var y1 = GTE.renderBox[1] +   (GTE.renderBox[3] - GTE.renderBox[1])/2;
	var y2 = GTE.renderBox[1] +   (GTE.renderBox[3] - GTE.renderBox[1])/2;


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

	ctx.fillStyle   = 'rgb(255,255,255)';
	ctx.strokeStyle = 'rgb(0,0,0)';
	ctx.font = 72*GTE.getRenderBoxWidth()/600 + "px Verdana";

	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	ctx.fillText(centerText,(x1+x2)/2,y1);
	ctx.fillText(leftFormat,x1,y1);
	ctx.fillText(rightFormat,x2,y2);

	ctx.strokeText(centerText,(x1+x2)/2,y1);
	ctx.strokeText(leftFormat,x1,y1);
	ctx.strokeText(rightFormat,x2,y2);

	if(GTE.levelSettings.integerMass){
		var leftFactorsFormat  = GTE.formatPrimeFactors(GTE.getPrimeFactors(sumLAbs));
		var rightFactorsFormat = GTE.formatPrimeFactors(GTE.getPrimeFactors(sumRAbs));
		ctx.fillStyle   = 'rgb(0,0,0)';
		ctx.font = 12*GTE.getRenderBoxWidth()/600 + "px Verdana";
		ctx.fillText(leftFactorsFormat,x1,y1+50*GTE.getRenderBoxWidth()/600);
		ctx.fillText(rightFactorsFormat,x2,y2+50*GTE.getRenderBoxWidth()/600);
	}

	//Find closest particles
	if(firstRender){
		var cL = GTE.getEndGoalsFactors(sumLAbs,'left');
		var cR = GTE.getEndGoalsFactors(sumRAbs,'right');

	    var iL = 0;
	    var iR = 0;
	    var goals;
	    for(var k = 0; k <= 1; k++){
	    	if(k == 0){
	    		goals = cL;
	    	}else{
	    		goals = cR;
	    	}
		    for(var j = 0; j < goals.length; j++){
		    	var c = goals[j];
		    	var best = 100;
		    	var bestI = 0;
			  	for(var i = 0; i < GTE.levelState.particles.length; i++){
					var p = GTE.levelState.particles[i];
					var positiveLeft  = p.x < 1 && p.m > 0 || p.x >=1 && p.m < 0;
					var positiveRight = p.x < 1 && p.m < 0 || p.x >=1 && p.m > 0;
					if(k == 0 && positiveLeft || k == 1 && positiveRight){
						var r = Math.sqrt(Math.pow(p.x-c.x,2)+Math.pow(p.y-c.y,2));
						if(r < best && p.iE < 0){	
							best = r;
							bestI = i;
						}
					}
				}

				//Init spring force
				var x = c.x;
				var y = c.y;

				var p = GTE.levelState.particles[bestI];
				var force = {
					p: p,
					k: 7,
					x: x,
					y: y,
					r0: 0
				};

				GTE.levelState.staticSpringForces.push(force);
				GTE.levelState.particles[bestI].iE = j;
			}
		}
	}

	ctx.restore();
};