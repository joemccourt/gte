"use strict";

GTE.maxLevel = 50;
GTE.level = 0;
GTE.stage = 0;
GTE.stagesWon = 0;
GTE.stagesLost = 0;

//View space filing tree for debug
GTE.viewAABBTree = false;

//Timing (ms)
GTE.startNewStageAnimationTime = 0;
GTE.startEndStageAnimationTime = 0;
GTE.newStageAnimationTime = 500;
GTE.endStageAnimationTime = 3000;

GTE.levelState = {};
GTE.AABBTree = {};

// State Flags
GTE.menuView = false;
GTE.startNewStageAnimation = false;
GTE.startEndStageAnimation = false;
GTE.animatingNewStage = false;
GTE.animatingEndStage = false;

GTE.wonGame = false;
GTE.toSaveGame = true;
GTE.playingLevel = true;
GTE.lastWon = true;

GTE.levelCompleted = false;
GTE.toStartNewStage = false;
GTE.dirtyBG = true;

GTE.buttons = [
	{
		'name':'group1',
		'text':'',
		'box': [0.0,1.015,0.45,1.1],
		'r':0.5
	},
	{
		'name':'group2',
		'text':'',
		'box': [0.55,1.015,1,1.1],
		'r':0.5
	},
	{
		'name':'menu',
		'text':'',
		'box': [1.01,0,1.07,0.08],
		'r':0.1
	}];

GTE.buttonsMenu = [
	{
		'name':'background',
		'text':'',
		'fillStyle': 'rgba(255,255,255,0.5)',
		'box': [0.2,0.2,0.8,0.8],
		'r':0.05
	},
	{
		'name':'replay',
		'text':'',
		'box': [0.26,0.55,0.38,0.7],
		'r':0.1
	},
	{
		'name':'quit',
		'text':'',
		'box': [0.44,0.55,0.56,0.7],
		'r':0.1
	},
	{
		'name':'next',
		'text':'',
		'box': [0.62,0.55,0.74,0.7],
		'r':0.1
	}];

GTE.sanitizeButtons = function(){

	var defaultButton = 
	{
		'name':'',
		'text':'',
		'box': [0,0,0,0],
		'r':0,
		'fillStyle': 'rgba(200,200,200,1)',
		'strokeStyle': 'rgba(0,0,0,0.5)'
	}

	var i,b,key;
	for(i = 0; i < GTE.buttons.length; i++){
		b = GTE.buttons[i];
		for(key in defaultButton){
			if(defaultButton.hasOwnProperty(key) && b[key] == null){
				b[key] = defaultButton[key];
			}
		}
	}

	for(i = 0; i < GTE.buttonsMenu.length; i++){
		b = GTE.buttonsMenu[i];
		for(key in defaultButton){
			if(defaultButton.hasOwnProperty(key) && b[key] == null){
				b[key] = defaultButton[key];
			}
		}
	}
};

GTE.setLevelRenderBox = function(){
	var w = GTE.canvas.width;
	var h = GTE.canvas.height;
	GTE.renderBoxGap = 0;
	GTE.renderBox = [w*0.02+0.5|0,h*0.02+0.5|0,w*0.9+0.5|0,h*0.9+0.5|0];
	GTE.leftWall  = 1 - GTE.renderBoxGap/GTE.getRenderBoxWidth();
	GTE.rightWall = 1 + GTE.renderBoxGap/GTE.getRenderBoxWidth();
};

GTE.startNewStage = function(){			
	GTE.toStartNewStage = false;
	GTE.playingLevel = true;
	GTE.initModel();
	GTE.boardView = false;
	GTE.menuView = false;
	GTE.dirtyCanvas = true;
	GTE.pCanvases = [];
	GTE.startNewStageAnimation = true;
	GTE.saveGameState();
};

GTE.clickGroup = function(groupID){
	if(GTE.playingLevel && !GTE.levelCompleted){
		var winningGroup = GTE.getGTEGroup();

		if(winningGroup == groupID || winningGroup == 0){
			GTE.winStage();
		}else{
			GTE.loseStage();
		}
	}
};

GTE.winStage = function(){
	GTE.lastWon = true;

	GTE.stagesWon++;
	GTE.stage++;

	GTE.endStage();
};

GTE.loseStage = function(){
	GTE.lastWon = false;

	GTE.stagesLost++;
	GTE.stage++;

	GTE.endStage();
};

GTE.quit = function(){
	GTE.stagesWon = 0;
	GTE.stagesLost = 0;
	GTE.stage = 0;
	GTE.viewBoard();
};

GTE.endStage = function(){
	if(GTE.stage >= GTE.levelSettings['rounds']){
		var stars = 0;
		if(GTE.stagesWon >= GTE.levelSettings['starReqs'][2]){
			stars = 3;
		}else if(GTE.stagesWon >= GTE.levelSettings['starReqs'][1]){
			stars = 2;
		}else if(GTE.stagesWon >= GTE.levelSettings['starReqs'][0]){
			stars = 1;			
		}

		if(stars > 0){
			var levelStr = 'level'+GTE.level;
			if(GTE.userStats[levelStr] != null){
				GTE.userStats[levelStr].stars = Math.max(stars,GTE.userStats[levelStr].stars);
			}else{
				GTE.userStats[levelStr] = {};
				GTE.userStats[levelStr].stars = stars;
			}
		}

		GTE.levelCompleted = true;
	}else{
		GTE.levelCompleted = false;
	}

	GTE.saveGameState();

	GTE.playingLevel = false;
	GTE.animatingNewStage = false;
	GTE.startEndStageAnimation = true;
	GTE.dirtyCanvas = true;	
};

GTE.openMenu = function(){
	GTE.menuView = true;
	GTE.dirtyCanvas = true;
};

GTE.closeMenu = function(){
	GTE.menuView = false;
	GTE.dirtyCanvas = true;

	if(GTE.toStartNewStage){
		GTE.startNewStage();
	}
};

// **** Level Events **** //
GTE.mousemoveLevel = function(x,y,touchIndex){
	if(touchIndex == null){touchIndex = 0;}
	if(GTE.mouse === "down"){
		GTE.updateMouseForce(touchIndex,x,y);
	}
};

GTE.mousedownLevel = function(x,y,touchIndex){
	if(touchIndex == null){touchIndex = 0;}
	GTE.mouse = "down";

	var buttons;
	if(GTE.menuView){
		buttons = GTE.buttonsMenu;
	}else{
		buttons = GTE.buttons;
	}

	for(var i = 0; i < buttons.length; i++){
		var tmpCoords = GTE.gameToBoardInternalSpace(x,y);
		var xI = tmpCoords[0];
		var yI = tmpCoords[1];

		var button = buttons[i];
		
		if(xI >= button.box[0] && xI <= button.box[2] && yI >= button.box[1] && yI <= button.box[3]){
			if(button.name === "group1"){
				GTE.clickGroup(1);
			}else if(button.name === "group2"){
				GTE.clickGroup(2);
			}else if(button.name === "menu"){
				GTE.openMenu();
			}else if(button.name === "quit"){
				GTE.setView("board");
			}else if(button.name === "replay"){
				if(GTE.levelCompleted){
					GTE.selectLevel(GTE.level);
				}else{
					GTE.closeMenu();
				}
			}else if(button.name === "next" && GTE.canPlayLevel(GTE.level+1)){
				GTE.selectLevel(GTE.level+1);	
			}

			if(button.name !== "background"){
				return;
			}
		}
	}

	var minD2 = 999999999999;
	var minI = -1;
	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		var dist2 = (p.x-x)*(p.x-x) + (p.y-y)*(p.y-y);
		if(dist2 < minD2){
			minD2 = dist2;
			minI = i;
		}
	}
	if(minI >= 0){
		GTE.createMouseForce(touchIndex,minI,x,y);
	}
};

GTE.mouseupLevel = function(x,y,touchIndex){
	if(touchIndex == null){touchIndex = 0;}
	GTE.mouse = "up";
	GTE.destroyMouseForce(touchIndex,x,y);
};

GTE.keydownLevel = function(k){

	//112 = 'p'
	//114 = 'r'
	//115 = 's'
	if(k == 37 && GTE.playingLevel){
		GTE.clickGroup(1);
	}else if(k == 39 && GTE.playingLevel){
		GTE.clickGroup(2);
	}else if(k == 81){
		GTE.openMenu();
	}
};