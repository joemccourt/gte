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
	ctx.beginPath();
		ctx.moveTo(0+w*Math.random()*0.4,h-1);
		ctx.bezierCurveTo(w*0.56+w*Math.random()*0.4,h*0.36,w*0.49+w*Math.random()*0.4,h*0.96,w-1+w*Math.random()*0.4,0);
		ctx.bezierCurveTo(w*0.43+w*Math.random()*0.4,h*0.96,w*0.56+w*Math.random()*0.4,h*0.46,w/3,h-1);
		ctx.closePath();
	ctx.fill();

	ctx.beginPath();
		ctx.moveTo(0+w*Math.random()*0.4,h*0.5);
		ctx.bezierCurveTo(w*0.36+w*Math.random()*0.4,h*0.26,w*0.39+w*Math.random()*0.4,h*0.66,w*0.7+w*Math.random()*0.4,0);
		ctx.bezierCurveTo(w*0.49+w*Math.random()*0.4,h*0.96,w*0.56+w*Math.random()*0.4,h*0.36,0+w*Math.random()*0.4,h*0.7);
		ctx.closePath();
	ctx.fill();

	ctx.restore();
};