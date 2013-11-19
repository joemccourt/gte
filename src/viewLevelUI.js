"use strict";

GTE.drawProgress = function(){
	var ctx = GTE.ctx;
	ctx.save();

	var winColorStr  = 'rgba(0,150,0,1)';
	var loseColorStr = 'rgba(150,0,0,1)';

	var winStyle, loseStyle;

	var box = [1.02,0.1,1.06,1.08];
	
	var canvasCoordTL = GTE.internalToRenderSpace(box[0],box[1]);
	var canvasCoordBR = GTE.internalToRenderSpace(box[2],box[3]);

	var x1 = canvasCoordTL[0]+0.5;
	var y1 = canvasCoordTL[1]+0.5;
	var x2 = canvasCoordBR[0]+0.5;
	var y2 = canvasCoordBR[1]+0.5;

	var r = 0.5 * Math.min(y2 - y1, x2 - x1);

	var n = GTE.levelSettings['rounds'];
	var l = GTE.stagesLost;
	var w = GTE.stagesWon;
	    
	ctx.beginPath();
	ctx.moveTo(x1,y1+r);
	ctx.arc(x2-r,y1+r,r,-Math.PI,0,false);

	ctx.lineTo(x2,y2-r);
	ctx.arc(x2-r,y2-r,r,0,Math.PI/2,false);
	ctx.lineTo(x1+r,y2);
	ctx.arc(x1+r,y2-r,r,Math.PI/2,Math.PI,false);
	ctx.lineTo(x1,y+0.5);
	ctx.closePath();

	var color = {r:245,g:245,b:245};
	var colorShadow = {r:color.r-30,g:color.g-30,b:color.b-30};
	var grd = ctx.createLinearGradient(x1,y1,x2,y1);

	grd.addColorStop(0.15, GTE.colorToStr(color));
	grd.addColorStop(0.70, GTE.colorToStr(colorShadow));
	grd.addColorStop(0.90, GTE.colorToStr(colorShadow));
	grd.addColorStop(1.00, GTE.colorToStr(color));
	ctx.fillStyle = grd;

	ctx.fill();

	loseStyle = ctx.createLinearGradient(x1,y1,x2,y1);
	var color = GTE.colors.loseColor;
	var colorShadow = {r:color.r-30,g:color.g-30,b:color.b-30};
	loseStyle.addColorStop(0.00,GTE.colorToStr(colorShadow));
	loseStyle.addColorStop(0.15,GTE.colorToStr(color));
	loseStyle.addColorStop(0.65,GTE.colorToStr(color));
	loseStyle.addColorStop(1.00,GTE.colorToStr(colorShadow));

	winStyle = ctx.createLinearGradient(x1,y1,x2,y1);
	var color = GTE.colors.winColor;
	var colorShadow = {r:color.r-30,g:color.g-30,b:color.b-30};
	winStyle.addColorStop(0.00, GTE.colorToStr(colorShadow));
	winStyle.addColorStop(0.15, GTE.colorToStr(color));
	winStyle.addColorStop(0.65, GTE.colorToStr(color));
	winStyle.addColorStop(1.00, GTE.colorToStr(colorShadow));

	//Lost portion
	if(l > 0 && l < n){
		var y = y1+(y2-y1)*l/n+0.5|0;
		ctx.beginPath();
		ctx.moveTo(x1+r,y1);
		ctx.lineTo(x2-r,y1);
		ctx.arc(x2-r,y1+r,r,-Math.PI/2,0,false);
		ctx.lineTo(x2,y+0.5);
		ctx.lineTo(x1,y+0.5);
		
		ctx.lineTo(x1,y1+r);
    	ctx.arc(x1+r,y1+r,r,Math.PI,3*Math.PI/2,false);
    
		ctx.closePath();
    	ctx.fillStyle = loseColorStr;
		ctx.fillStyle = loseStyle;

    	ctx.fill();
	}

	if(w > 0 && w < n){
		var y = y2-(y2-y1)*w/n+0.5|0;
		ctx.beginPath();
		ctx.moveTo(x1,y+0.5);
		ctx.lineTo(x2,y+0.5);
		ctx.lineTo(x2,y2-r);
		ctx.arc(x2-r,y2-r,r,0,Math.PI/2,false);
		ctx.lineTo(x1+r,y2);
		ctx.arc(x1+r,y2-r,r,Math.PI/2,Math.PI,false);
		ctx.lineTo(x1,y+0.5);
		ctx.closePath();

    	ctx.fillStyle = winStyle;
    	ctx.fill();
	}

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

    ctx.strokeStyle  = 'rgba(0,0,0,1)';
    ctx.lineWidth = 2;
    ctx.stroke();

    if(w == n){
    	ctx.fillStyle = winStyle;
    	ctx.fill();
    }else if(l == n){
    	ctx.fillStyle = loseStyle;
    	ctx.fill();
    }


	ctx.beginPath();
	ctx.strokeStyle = 'rgba(0,0,0,1)';
	ctx.lineWidth = 1;
	for(var i = 1; i < n; i++){
		var targetHeight = y1+i*(y2-y1)/n + 0.5 | 0;
		ctx.moveTo(x1,targetHeight+0.5);
		ctx.lineTo(x2,targetHeight+0.5);
	}
	ctx.stroke();
	ctx.closePath();

	for(var s = 0; s < GTE.levelSettings['starReqs'].length; s++){
		var reqN = GTE.levelSettings['starReqs'][s];
		var targetHeight = y1+(n-reqN+0.5)*(y2-y1)/n + 0.5 | 0;
		
		ctx.beginPath();	
	    ctx.fillStyle = GTE.starColorStr[s];
		ctx.strokeStyle = 'rgba(0,0,0,0.3)';
		GTE.drawStar(ctx, (x1+x2)/2, targetHeight, r*0.8);
		ctx.stroke();
		ctx.fill();
		ctx.closePath();
	}

    ctx.restore();
};


GTE.drawButtons = function(mode){
	var ctx = GTE.ctx;
	ctx.save();

	var buttons = GTE.buttons.slice(0);
	if(mode === "menu"){
		buttons = buttons.concat(GTE.buttonsMenu);
	}

	for(var i = 0; i < buttons.length; i++){
		var button = buttons[i];
		
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

		if(button.name === "background"){
			ctx.fillStyle = 'rgba(255,255,255,0.7)';
		}else{
			var grd = ctx.createLinearGradient(x1,y1,x1,y2);
			grd.addColorStop(0, 'rgb(230,230,230)');
			grd.addColorStop(0.8, 'rgb(170,170,170)');
			grd.addColorStop(1, 'rgb(130,130,130)');

			ctx.fillStyle = grd;
		}

		ctx.lineWidth = 2;
		if(button.name == "group1" || button.name == "group2"){

			ctx.lineWidth = 5;
			ctx.strokeStyle = 'rgb(68,93,130)';

			var grd = ctx.createLinearGradient(x1,y1,x1,y2);
			grd.addColorStop(0, 'rgb(220,235,255)');
			grd.addColorStop(0.5, 'rgb(100,165,255)');
			grd.addColorStop(0.9, 'rgb(100,165,255)');
			grd.addColorStop(1, 'rgb(68,93,130)');
			ctx.fillStyle = grd;
	    }

		ctx.stroke();
		ctx.fill();

		if(button.text.length > 0){
			ctx.fillStyle = 'rgb(255,255,255)';
			ctx.font = height + "px Verdana";

			var height = 32*(GTE.getRenderBoxWidth()+GTE.getRenderBoxHeight())/2000;
			ctx.textAlign = 'center';
			ctx.textBaseline = 'baseline';

		    ctx.fillText(button.text,(x1+x2)/2,y1 + height*1.5);
	    }

		if(button.name === "background"){
			var stars = 0;
			if(GTE.stagesWon >= GTE.levelSettings.starReqs[2]){
				stars = 3;
			}else if(GTE.stagesWon >= GTE.levelSettings.starReqs[1]){
				stars = 2;
			}else if(GTE.stagesWon >= GTE.levelSettings.starReqs[0]){
				stars = 1;
			}
			var levelStats = GTE.userStats['level'+GTE.level];
			if(levelStats){
				stars = Math.max(stars,levelStats.stars);
			}

			var h = y2-y1;
			var w = x2-x1;
			var starR = 0.2*Math.min(0.8*w,h);

			for(var j = 0; j < 3; j++){
				var yStar = y1+h*0.22;
				var xStar;

				if(j == 0){
					yStar = y1+h*0.3;
					xStar = x1+(w/2-starR)/2;
				}else if(j == 1){
					yStar = y1+h*0.3;
					xStar = x1+(w-(w/2-starR)/2);
				}else if(j == 2){
					yStar = y1+h*0.22;
					xStar = x1+w/2;
				}

				GTE.drawStar(ctx, xStar, yStar, starR);
				ctx.stroke();

				if(stars > j){
					ctx.fillStyle = GTE.starColorStr[j];
				}else{
					ctx.lineWidth = 5;
					ctx.strokeStyle = GTE.colorToStr(GTE.starColors[j],0.8);
					ctx.stroke();
					ctx.fillStyle = 'rgba(0,0,0,1)';
				}
					ctx.fill();
			}
	
			var height = 42*(GTE.getRenderBoxHeight())/1000;

			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.font = 1.6*height + "px Verdana";
			ctx.fillStyle = 'rgba(0,0,0,1)';
			ctx.strokeStyle = 'rgba(255,255,255,0.5)';
			ctx.lineWidth = 1;
	    	ctx.fillText("Level "+GTE.level,(x1+x2)/2,y1 + 0.45*(y2-y1));
	    	ctx.strokeText("Level "+GTE.level,(x1+x2)/2,y1 + 0.45*(y2-y1));
		}else if(button.name === "menu" || button.name === "quit" ){
			var w = x2-x1;
			var h = y2-y1;
	
			ctx.strokeStyle = 'rgba(0,0,0,1)';

			// ctx.lineWidth = 3;
			var left   = x1+w*0.33;
			var right  = x1+w*0.75;
			var top    = y1+h*0.25;
			var bottom = y1+h*0.75;

			ctx.moveTo(left,top+h/10);
			ctx.lineTo(left,top);
			ctx.lineTo(right,top);
			ctx.lineTo(right,bottom);
			ctx.lineTo(left,bottom);
			ctx.lineTo(left,bottom-h/10);

			ctx.moveTo(x1+w/2,y1+h/2);
			ctx.lineTo(left-w/10,y1+h/2);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(x1+w/10,     y1+h/2);
			ctx.lineTo(left-w/10,top+h/10);
			ctx.lineTo(left-w/10,bottom-h/10);
			ctx.closePath();
			ctx.fillStyle = 'rgba(0,0,0,1)';

			ctx.fill();
		}else if(button.name === "next"){
			if(GTE.canPlayLevel(GTE.level+1)){
				ctx.strokeStyle = 'rgba(0,0,0,1)';
				ctx.fillStyle   = 'rgba(0,0,0,1)';
			}else{
				ctx.strokeStyle = 'rgba(0,0,0,0.3)';
				ctx.fillStyle   = 'rgba(0,0,0,0.3)';
			}
	
			var w = x2-x1;
			var h = y2-y1;

			var left   = x1+w*0.33;
			var right  = x1+w*0.75;
			var top    = y1+h*0.35;
			var bottom = y1+h*0.65;

			ctx.moveTo(left,y1+h/2);
			ctx.lineTo(right-w/10,y1+h/2);
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(right-w/10,top);
			ctx.lineTo(right-w/10,bottom);
			ctx.lineTo(right,y1+h/2);
			ctx.closePath();	
			ctx.fill();
		}else if(button.name === "replay"){
			ctx.strokeStyle = 'rgba(0,0,0,1)';
			ctx.fillStyle = 'rgba(0,0,0,1)';
			if(GTE.levelCompleted){
				var w = x2-x1;
				var h = y2-y1;

				var r = Math.min(w,h)*0.3;

				var centerX = x1+w/2;
				var centerY = y1+h/2;

				var a1 = 20 * Math.PI/180;
				var a2 = 315 * Math.PI/180;

				var endX = centerX + r*Math.cos(a2);
				var endY = centerY + r*Math.sin(a2);

				var end3X = centerX + r*Math.cos(a2+25*Math.PI/180);
				var end3Y = centerY + r*Math.sin(a2+25*Math.PI/180);
				
				var end1X = end3X;
				var end1Y = end3Y - r*0.65;

				var end2X = end3X - r*0.65;
				var end2Y = end3Y;

				ctx.beginPath();
				ctx.arc(centerX, centerY, r, a1, a2, false);

				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(end1X,end1Y);
				ctx.lineTo(end2X,end2Y);
				ctx.lineTo(end3X,end3Y);
				ctx.closePath();
				ctx.fill();

			}else{
				var w = x2-x1;
				var h = y2-y1;

				var left   = x1+w*0.25;
				var right  = x1+w*0.75;
				var top    = y1+h*0.25;
				var bottom = y1+h*0.75;

				ctx.moveTo(left,top);
				ctx.lineTo(right,bottom);

				ctx.moveTo(right,top);
				ctx.lineTo(left,bottom);
				ctx.stroke();
			}
		}
	}

    ctx.restore();
};