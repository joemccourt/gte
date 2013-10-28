GTE.pCanvases = {};

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
	var darkBlue = GTE.colors.particleDarkBlue;
	
	if(p.m > 0){
		ctx.fillStyle = "rgba("+white.r+","+white.g+","+white.b+",0.8)";
	}else{
		ctx.fillStyle = "rgba("+darkBlue.r+","+darkBlue.g+","+darkBlue.b+",0.8)";
	}
	ctx.beginPath();
		ctx.arc(r+offX,r+offY,r, 0, 2 * Math.PI, false);
	ctx.closePath();
	ctx.fill();
	
	ctx.globalCompositeOperation = "source-atop";
	if(p.m > 0){
		ctx.fillStyle = "rgba("+blue.r+","+blue.g+","+blue.b+",1)";
	}else{
		ctx.fillStyle = "rgba("+red.r+","+red.g+","+red.b+",1)";
	}

	drawStripe = function(center,angleDelta){
		var a1  = Math.PI/180 * (45-angleDelta);
		var a2  = Math.PI/180 * (45+angleDelta);
		var sa1 = Math.sin(a1);
		var ca1 = Math.cos(a1);
		var sa2 = Math.sin(a2);
		var ca2 = Math.cos(a2);
		var fR = 0.7;
		var x11 = center.x-fR*ca1;
		var x21 = center.x+fR*ca1;
		var y11 = center.y+fR*sa1;
		var y21 = center.y-fR*sa1;

		var x12 = center.x-fR*ca2;
		var x22 = center.x+fR*ca2;
		var y12 = center.y+fR*sa2;
		var y22 = center.y-fR*sa2;

		var rControl = fR * (0.5*Math.random()+0.5);

		var ac1 = a1 + Math.PI/180*angleDelta*2*(Math.random()-0.5);
		var ac4 = a1 + (a1-ac1);

		var ac2 = Math.PI+a2 + Math.PI/180*angleDelta*2*(Math.random()-0.5);
		var ac3 = Math.PI+a2 + (Math.PI+a2-ac2);

		var c1x = x11+rControl*Math.cos(ac1);
		var c1y = y11-rControl*Math.sin(ac1);
		var c2x = x22+rControl*Math.cos(ac2);
		var c2y = y22-rControl*Math.sin(ac2);
		var c3x = x21+rControl*Math.cos(ac3);
		var c3y = y21-rControl*Math.sin(ac3);
		var c4x = x12+rControl*Math.cos(ac4);
		var c4y = y12-rControl*Math.sin(ac4);

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
		}
		drawStripe(center,angleDelta);
	}

	ctx.restore();
};