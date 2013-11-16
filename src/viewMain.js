"use strict";

GTE.drawGame = function(drawGameParams){
	if(drawGameParams.phase === 'board'){
		GTE.drawBoardGame();
	}else if(drawGameParams.phase === 'run'){
		GTE.drawGameRun(drawGameParams);
	}else if(drawGameParams.phase === 'start'){
		GTE.drawGameStart(drawGameParams);
	}else if(drawGameParams.phase === 'end'){
		GTE.drawGameEnd(drawGameParams);
	}else if(drawGameParams.phase === 'menu'){
		GTE.drawGameMenu(drawGameParams);
	}
};

GTE.drawGameRun = function(drawGameParams){
	GTE.drawBackground();
	GTE.drawMidline();
	GTE.drawMouseForces();
	GTE.drawLevel();
	GTE.drawButtons();
	GTE.drawProgress();

	if(GTE.viewAABBTree){
		GTE.drawAABBTree();
	}
};

GTE.drawGameStart = function(drawGameParams){
	GTE.drawBackground();
	GTE.drawMidline(Math.pow(drawGameParams.timeSinceStart/GTE.newStageAnimationTime,4));
	GTE.drawMouseForces();
	GTE.drawLevel();
	GTE.drawButtons();
	GTE.drawProgress();
};

GTE.drawGameEnd = function(drawGameParams){
	GTE.drawBackground(true);
	GTE.drawMidline(Math.pow(drawGameParams.timeUntilEnd/GTE.endStageAnimationTime,4));
	GTE.drawMouseForces();
	GTE.drawButtons();
	GTE.drawProgress();
	GTE.drawLevel();
	GTE.endLevelAnimation(drawGameParams.timeUntilEnd);
};

GTE.drawGameMenu = function(drawGameParams){
	GTE.drawBackground();
	GTE.drawMidline();
	GTE.drawMouseForces();
	GTE.drawLevel();

	if(GTE.levelCompleted){	
		GTE.endLevelAnimation(0);
	}

	GTE.drawButtons("menu");		
	GTE.drawProgress();
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

	ctx.closePath();
};