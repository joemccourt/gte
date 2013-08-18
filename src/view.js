GTE.drawGame = function(){
	GTE.drawBackground();
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