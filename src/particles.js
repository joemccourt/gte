GTE.pCanvases = {};

GTE.getFillGrad = function(ctx,color,offX,offY,r,w,h,alpha){

	// create radial gradient
	var grd = ctx.createRadialGradient((r+offX)*0.85,(r+offY)*0.7,r*0.1,r+offX,r+offY,r);
    
    var colorShine = {r:color.r,g:color.g,b:color.b};
    var colorShadow = {r:color.r,g:color.g,b:color.b};
    colorShine.r += 30;
    colorShine.g += 30;
    colorShine.b += 30;

    if(colorShine.r > 255){colorShine.r = 255;}
    if(colorShine.g > 255){colorShine.g = 255;}
    if(colorShine.b > 255){colorShine.b = 255;}

    colorShadow.r = colorShadow.r * 0.7 | 0;
    colorShadow.g = colorShadow.g * 0.7 | 0;
    colorShadow.b = colorShadow.b * 0.7 | 0;

    if(colorShadow.r < 0){colorShadow.r = 0;}
    if(colorShadow.g < 0){colorShadow.g = 0;}
    if(colorShadow.b < 0){colorShadow.b = 0;}

	grd.addColorStop(0, GTE.colorToStr(colorShine,alpha)); // center
	grd.addColorStop(0.98, GTE.colorToStr(color,alpha));
	grd.addColorStop(1, GTE.colorToStr(colorShadow,alpha));

	return grd;
};

GTE.drawParticle = function(canvas,p,r){
	var ctx = canvas.getContext('2d');
	ctx.save();

	var w = canvas.width;
	var h = canvas.height;

	var offX = (w - 2*r)/2;
	var offY = (h - 2*r)/2;

	// GTE.colors.particleWhite
	var blue  = GTE.colors.particleBlue;
	var red   = GTE.colors.particleRed;
	var white = GTE.colors.particleWhite;
	var offWhite = GTE.colors.particleOffWhite;
	var darkBlue = GTE.colors.particleDarkBlue;

	var nWhite = GTE.negateColor(white);
	var nOffWhite = GTE.negateColor(offWhite);
	var nBlue = GTE.negateColor(blue);

	var massFraction = Math.abs(p.m)-Math.floor(Math.abs(p.m));
	var alpha = 1;
	if(massFraction > 0 && Math.abs(p.m) < 1){
		alpha = 0.5;
	}

	var color = white;
	if(p.m < 0){
		color = nWhite;
	}
	
	ctx.fillStyle = GTE.getFillGrad(ctx,color,offX,offY,r,w,h,alpha);

	ctx.beginPath();
		ctx.arc(r+offX,r+offY,r, 0, 2*Math.PI, false);
	ctx.closePath();
	ctx.fill();

	if(massFraction > 0){
		if(Math.abs(p.m) < 1){
			color = white;
			if(p.m < 0){
				color = nWhite;
			}
		}else{
			color = offWhite;
			if(p.m < 0){
				color = nOffWhite;
			}
		}
		ctx.fillStyle = GTE.getFillGrad(ctx,color,offX,offY,r,w,h);

		var angleEnd = 2*Math.PI * massFraction;
		ctx.beginPath();
			ctx.moveTo(r+offX,r+offY);
			ctx.lineTo(r+offX+r,r+offY)
			ctx.arc(r+offX,r+offY,r, 0, angleEnd, false);
		ctx.closePath();
		ctx.fill();
	}
	
	ctx.globalCompositeOperation = "source-atop";
	if(p.m > 0){
		ctx.fillStyle = ctx.fillStyle = GTE.getFillGrad(ctx,blue,offX,offY,r,w,h);
	}else{
		ctx.fillStyle = ctx.fillStyle = GTE.getFillGrad(ctx,nBlue,offX,offY,r,w,h);
	}

	drawStripe = function(center,angleDelta,seed){
		var rng = GTE.rng;
		rng.setSeed(seed);
		rng.getFloat();
		
		var a1  = Math.PI/180 * (45-angleDelta+rng.getFloat()*20-10);
		var a2  = a1 + Math.PI/180 * 2*angleDelta;
		var sa1 = Math.sin(a1);
		var ca1 = Math.cos(a1);
		var sa2 = Math.sin(a2);
		var ca2 = Math.cos(a2);
		var fR = 0.57;
		var x11 = center.x-fR*ca1;
		var x21 = center.x+fR*ca1;
		var y11 = center.y+fR*sa1;
		var y21 = center.y-fR*sa1;

		var x12 = center.x-fR*ca2;
		var x22 = center.x+fR*ca2;
		var y12 = center.y+fR*sa2;
		var y22 = center.y-fR*sa2;

		var rControl1 = fR * (0.5*rng.getFloat()+0.5);
		var rControl2 = fR * (0.5*rng.getFloat()+0.5);
		var rControl3 = fR * (0.5*rng.getFloat()+0.5);
		var rControl4 = fR * (0.5*rng.getFloat()+0.5);

		var ac1 = a1 + Math.PI/180*angleDelta*2*(rng.getFloat()-0.5);
		var ac4 = a1 + (a1-ac1);

		var ac2 = Math.PI+a2 + Math.PI/180*angleDelta*2*(rng.getFloat()-0.5);
		var ac3 = Math.PI+a2 + Math.PI+a2-ac2;

		var c1x = x11+rControl1*Math.cos(ac1);
		var c1y = y11-rControl1*Math.sin(ac1);
		var c2x = x22+rControl2*Math.cos(ac2);
		var c2y = y22-rControl2*Math.sin(ac2);
		var c3x = x21+rControl3*Math.cos(ac3);
		var c3y = y21-rControl3*Math.sin(ac3);
		var c4x = x12+rControl4*Math.cos(ac4);
		var c4y = y12-rControl4*Math.sin(ac4);

		ctx.beginPath();
			ctx.moveTo(w*x11,h*y11);
			ctx.bezierCurveTo(w*c1x,h*c1y,w*c2x,h*c2y,w*x22,h*y22);
			ctx.bezierCurveTo(w*c3x,h*c3y,w*c4x,h*c4y,w*x11,h*y11);
			ctx.closePath();
		ctx.fill();

		var debugPoints = false;
		if(debugPoints){
			ctx.fillStyle = "red";
			ctx.beginPath();
			ctx.arc(w*x11, h*y11, 3, 0, 2 * Math.PI, false);
			ctx.arc(w*x21, h*y21, 3, 0, 2 * Math.PI, false);
			ctx.arc(w*x12, h*y12, 3, 0, 2 * Math.PI, false);
			ctx.arc(w*x22, h*y22, 3, 0, 2 * Math.PI, false);

			ctx.arc(w*c1x, h*c1y, 3, 0, 2 * Math.PI, false);
			ctx.arc(w*c2x, h*c2y, 3, 0, 2 * Math.PI, false);
			ctx.arc(w*c3x, h*c3y, 3, 0, 2 * Math.PI, false);
			ctx.arc(w*c4x, h*c4y, 3, 0, 2 * Math.PI, false);
			ctx.closePath();
			ctx.fill();
		}
	}

	var mass = Math.abs(p.m);

	var center;
	for(var i = 0; i < mass; i++){
		var dx = 0.5*Math.ceil(i/2) * (2*(i%2)-1) / mass;
		var angleDelta = 10 / mass;
		center = {x:0.5+dx,y:0.5+dx};	

		if(mass - i < 1){
			angleDelta*=mass*(mass-i);
		}else{
			drawStripe(center,angleDelta,p.id);
		}
	}

	ctx.restore();
};