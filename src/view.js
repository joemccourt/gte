GTE.drawGame = function(){
	GTE.drawBackground();
	GTE.drawMidline();
	GTE.drawLevel();
	GTE.drawMouseForces();
};

GTE.drawMouseForces = function(){

	var ctx = GTE.ctx;
	ctx.save();

	for(var forceID = 0; forceID < 10; forceID++){
		var f = GTE.levelState.mouseForces[forceID];
		if(typeof f !== 'object'){continue;}
		var p = GTE.levelState.particles[f.pID];
		if(typeof p !== 'object'){continue;}

		var canvasCoordP = GTE.internalToRenderSpace(p.x/2,p.y);
		var canvasCoordF = GTE.internalToRenderSpace(f.fX/2,f.fY);

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
		var canvasCoord = GTE.internalToRenderSpace(p.x/2,p.y);

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

	ctx.fillStyle = 'rgba(0,150,0,'+(1-time/GTE.newLevelAnimationTime)+')';

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

GTE.updateUI = function(){
	$('#renderTime').text("Frame Render Time: "+(GTE.frameRenderTime+0.5|0)+"ms");
}