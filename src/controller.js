//GTE vars
var GTE = {};

GTE.canvasID = "#gameCanvas";

//Timing (ms)
GTE.startTime = (new Date()).getTime();
GTE.lastFrameTime = 0;
GTE.frameRenderTime = 0;
GTE.startNewStageAnimationTime = 0;
GTE.startEndStageAnimationTime = 0;
GTE.newStageAnimationTime = 500;
GTE.endStageAnimationTime = 2000;
GTE.UIUpdateTime = 10;
GTE.lastUIUpdateTime = 0;

//Visual settings
GTE.font = 'Verdana';
GTE.renderBox = [0,0,0,0];

//Game state bools
GTE.dirtyCanvas = true;
GTE.gameInProgress = false;
GTE.wonGame = false;
GTE.toSaveGame = true;
GTE.startNewStageAnimation = false;
GTE.startEndStageAnimation = false;
GTE.animatingNewStage = false;
GTE.animatingEndStage = false;
GTE.playingLevel = true;
GTE.boardGameView = true;
GTE.levelCompleted = false;
GTE.menuView = false;

GTE.viewAABBTree = true;

GTE.starColorStr = ['rgb(150,90,56)','rgb(204,194,194)','rgb(217,164,65)'];

GTE.drawBoardGameBox = [-0.1,-2,1.1,1.1];

GTE.drawBoardGameTransform = [1,0,0,0,
							  0,1,0,0,
							  0,0,1,0];
GTE.drawBoardGameTransformTmp = [1,0,0,0,
								 0,1,0,0,
								 0,0,1,0];
GTE.boardLevelRadius = 0.03; //*(w+h)/2

GTE.maxLevel = 100;
GTE.level = 0;
GTE.stage = 0;
GTE.stagesWon = 0;
GTE.stagesLost = 0;

GTE.userStats = {
	//'level0' : {'stars':2},
	// 'level1' : {'stars':3},
	// 'level2' : {'stars':1},
};

GTE.levelState = {};
GTE.AABBTree = {};

GTE.lastWon = true;

//Mouse state
GTE.mouse = "up";
GTE.mouseDownIndex = -1;
GTE.mouseDownPos = {x:0,y:0};
GTE.mouseDownLast = {x:0,y:0};


var kongregate = parent.kongregate;

GTE.buttons = [
	{
		'name':'group1',
		'text':'',
		'box': [0.05,1.015,0.4,1.1],
		'r':0.5
	},
	{
		'name':'group2',
		'text':'',
		'box': [0.6,1.015,0.95,1.1],
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
	}]

GTE.main = function(){
	GTE.startSession();
	requestNextAnimationFrame(GTE.gameLoop);
};

window.onload = GTE.main;

GTE.gameLoop = function(time){
	var ctx = GTE.ctx;

	if(time - GTE.lastFrameTime > 5000){GTE.lastFrameTime = time-100;}

	if(GTE.startEndStageAnimation){
		GTE.startEndStageAnimation = false;
		GTE.animatingEndStage = true;
		GTE.startEndStageAnimationTime = time;
		GTE.dirtyCanvas = true;
	}

	if(GTE.animatingEndStage && time - GTE.startEndStageAnimationTime > GTE.endStageAnimationTime){
		GTE.animatingEndStage = false;

		if(GTE.levelCompleted){
			GTE.openMenu();
		}else{
			GTE.startNewStage();
		}
	}

	if(GTE.startNewStageAnimation){
		GTE.startNewStageAnimation = false;
		GTE.animatingNewStage = true;
		GTE.startNewStageAnimationTime = time;
		GTE.dirtyCanvas = true;
	}
	if(GTE.animatingNewStage && time - GTE.startNewStageAnimationTime > GTE.newStageAnimationTime){
		GTE.animatingNewStage = false;
	}

	if(GTE.animatingEndStage || GTE.boardGameView){
	}else{
		GTE.updateModel(time - GTE.lastFrameTime);
	}

	if(GTE.dirtyCanvas){
		GTE.dirtyCanvas = false;

		var drawGameParams = {
			'phase' : 'run',
			'timeSinceStart' : time - GTE.startNewStageAnimationTime,
			'timeUntilEnd' : GTE.endStageAnimationTime - (time - GTE.startEndStageAnimationTime)
		};

		if(GTE.animatingNewStage){
			drawGameParams.phase = 'start';
			GTE.dirtyCanvas = true;
		}else if(GTE.animatingEndStage){
			drawGameParams.phase = 'end';
			GTE.dirtyCanvas = true;
		}else if(GTE.menuView){
			drawGameParams.phase = 'menu';
		}

		if(GTE.boardGameView){
			drawGameParams.phase = "board";
		}

		GTE.drawGame(drawGameParams);
	}

	if(time - GTE.lastUIUpdateTime > GTE.UIUpdateTime){
		GTE.updateUI();
	}

	requestNextAnimationFrame(GTE.gameLoop);

	GTE.frameRenderTime = time - GTE.lastFrameTime;
	GTE.lastFrameTime = time;
};

GTE.loadGameState = function(){
	if (!supports_html5_storage()) { return false; }
	GTE.gameInProgress = (localStorage["GTE.gameInProgress"] == "true");

	if(GTE.gameInProgress){
		GTE.userStats    = JSON.parse(localStorage["GTE.userStats"]);
		GTE.renderBox    = JSON.parse(localStorage["GTE.renderBox"]);
		GTE.level        = parseInt(localStorage["GTE.level"]);
		GTE.stage        = parseInt(localStorage["GTE.stage"]);
		GTE.stagesWon    = parseInt(localStorage["GTE.stagesWon"]);
		GTE.stagesLost   = parseInt(localStorage["GTE.stagesLost"]);
		GTE.boardGameView = parseInt(localStorage["GTE.boardGameView"]);	
		GTE.levelState    = JSON.parse(localStorage["GTE.levelState"]);
		GTE.drawBoardGameTransform = JSON.parse(localStorage['GTE.drawBoardGameTransform']);
		if(GTE.boardGameView === 0){
			GTE.levelSettings = JSON.parse(localStorage["GTE.levelSettings"]);
			GTE.playingLevel = parseInt(localStorage["GTE.playingLevel"]);	
		}
	}
	
};

GTE.saveGameState = function() {
	if (!supports_html5_storage()) { return false; }
	localStorage["GTE.gameInProgress"] = true; //temp disable for testing

	localStorage["GTE.userStats"]     = JSON.stringify(GTE.userStats);
	localStorage["GTE.renderBox"]     = JSON.stringify(GTE.renderBox);
	localStorage["GTE.levelState"]    = JSON.stringify(GTE.levelState);
	localStorage["GTE.levelSettings"] = JSON.stringify(GTE.levelSettings);
	localStorage["GTE.drawBoardGameTransform"] = JSON.stringify(GTE.drawBoardGameTransform);
	localStorage["GTE.level"]         = GTE.level;
	localStorage["GTE.stagesWon"]     = GTE.stagesWon;
	localStorage["GTE.stagesLost"]    = GTE.stagesLost;
	localStorage["GTE.stage"]         = GTE.stage;
	localStorage["GTE.boardGameView"] = GTE.boardGameView == true ? 1 : 0;
	localStorage["GTE.playingLevel"]  = GTE.playingLevel  == true ? 1 : 0;
};

GTE.setGameRenderBox = function(){
	var w = GTE.canvas.width;
	var h = GTE.canvas.height;
	GTE.renderBox = [w*0.02+0.5|0,h*0.02+0.5|0,w*0.9+0.5|0,h*0.9+0.5|0];
};

GTE.setBoardRenderBox = function(){
	var w = GTE.canvas.width;
	var h = GTE.canvas.height;
	GTE.renderBox = [w*0.02+0.5|0,h*0.02+0.5|0,w*0.98+0.5|0,h*0.98+0.5|0];
};

GTE.resizeToFit = function(){
	var w = $(window).width();
	var h = $(window).height();

	GTE.canvas.width = w;
	GTE.canvas.height = h;

	if(GTE.boardGameView){
		GTE.setBoardRenderBox();
	}else{
		GTE.scaleModel();
		GTE.setGameRenderBox();
		GTE.initAABBTree();
	}

	GTE.dirtyCanvas = true;
};

GTE.startSession = function(){
	GTE.canvas = $(GTE.canvasID)[0];
	GTE.ctx = GTE.canvas.getContext("2d");
	
	var w = GTE.canvas.width;
	var h = GTE.canvas.height;

	GTE.setGameRenderBox();
	
	GTE.loadGameState();
	GTE.initAABBTree();
	GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;

	GTE.resizeToFit();
	

	//GTE.startNewStage();	
	// GTE.viewBoard();


	//Start new game
	//if(!GTE.gameInProgress){
		//GTE.startGame();
	//}

	GTE.dirtyCanvas = true;
	GTE.sanitizeButtons();
	GTE.initEvents();
};

GTE.sanitizeButtons = function(){

	var defaultButton = 
	{
		'name':'',
		'text':'',
		'box': [0,0,0,0],
		'r':0,
		'fillStyle': 'rgba(200,200,200,1)',
		'strokeStyle': 'rgba(0,0,0,1)'
	}

	var i;
	for(i = 0; i < GTE.buttons.length; i++){
		var b = GTE.buttons[i];
		for(key in defaultButton){
			if(b[key] == null){
				b[key] = defaultButton[key];
			}
		}
	}

	for(i = 0; i < GTE.buttonsMenu.length; i++){
		var b = GTE.buttonsMenu[i];
		for(key in defaultButton){
			if(b[key] == null){
				b[key] = defaultButton[key];
			}
		}
	}

};

GTE.mousemove = function(x,y,touchIndex){
	if(touchIndex == null){touchIndex = 0;}
	//if(GTE.mouse === "down"){
		//if(GTE.mouseDownIndex >= 0){
			GTE.updateMouseForce(touchIndex,x,y);
		//}
	//}
};

GTE.mousedown = function(x,y,touchIndex){
	if(touchIndex == null){touchIndex = 0;}
	GTE.mouse = "down";
	GTE.mouseDownPos = {x:x,y:y};
	//GTE.mouseDownIndex = -1;

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
				GTE.viewBoard();
			}else if(button.name === "replay"){
				if(GTE.levelCompleted){
					GTE.selectLevel(GTE.level);
				}else{
					GTE.closeMenu();
				}
			}else if(button.name === "next" && GTE.userStats['level'+GTE.level] && GTE.userStats['level'+GTE.level].stars > 0){
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
			//GTE.mouseDownIndex = p.id;
			//idForces for possible multitouch ability in future
		}
	}
	if(minI >= 0){
		GTE.createMouseForce(touchIndex,minI,x,y);
	}
};

GTE.mouseup = function(x,y,touchIndex){
	if(touchIndex == null){touchIndex = 0;}
	GTE.mouse = "up";

	//if(GTE.mouseDownIndex >= 0){
		GTE.destroyMouseForce(touchIndex,x,y);
	//}
};

GTE.clickGroup = function(groupID){

	if(GTE.playingLevel){
		var winningGroup = GTE.getGTEGroup();

		if(winningGroup == groupID || winningGroup == 0){
			GTE.winStage();
		}else{
			GTE.loseStage();
		}
	}
};

GTE.winStage = function(){
	console.log("Win!");
	GTE.lastWon = true;

	GTE.stagesWon++;
	GTE.stage++;

	GTE.endStage();
};

GTE.loseStage = function(){
	console.log("Lose!");
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
	GTE.updateHUD();

	GTE.playingLevel = false;
	GTE.animatingNewStage = false;
	GTE.startEndStageAnimation = true;
	GTE.dirtyCanvas = true;
};

GTE.viewBoard = function(){
	GTE.boardGameView = true;
	GTE.dirtyCanvas = true;
	GTE.playingLevel = false;

	GTE.animatingEndStage = false;
	GTE.animatingNewStage = false;

	GTE.setBoardRenderBox();
	GTE.saveGameState();
};

GTE.startNewStage = function(){			
	GTE.playingLevel = true;
	GTE.initModel();
	GTE.updateHUD();
	GTE.boardGameView = false;
	GTE.menuView = false;
	GTE.dirtyCanvas = true;
	GTE.startNewStageAnimation = true;
	GTE.setGameRenderBox();
	GTE.saveGameState();
};

GTE.winGame = function(){
	if(GTE.level == GTE.maxLevel){
		GTE.maxLevel++;
		if(typeof kongregate !== "undefined"){
			kongregate.stats.submit("Max Level",GTE.maxLevel-4);
		}
	}

	GTE.level++;

	console.log("you win!");
	GTE.wonGame = true;
	//GTE.startGame();
};

GTE.selectLevel = function(i){
	GTE.level = i;
	GTE.lastWon = true;

	GTE.stage      = 0;
	GTE.stagesLost = 0;
	GTE.stagesWon  = 0;
	GTE.levelCompleted = false;

	GTE.startNewStage();
}

GTE.openMenu = function(){
	GTE.menuView = true;
	GTE.dirtyCanvas = true;
};

GTE.closeMenu = function(){
	GTE.menuView = false;
	GTE.dirtyCanvas = true;
};

// *** Board View Events ***
GTE.boardMouseup = function(x,y){
	GTE.mouse = "up";
	GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
	GTE.saveGameState();
};

GTE.boardMousedown = function(x,y){
	GTE.mouse = "down";

	GTE.mouseDownPos.x = x;
	GTE.mouseDownPos.y = y;

	GTE.mouseDownLast = {x:x,y:y};

	GTE.drawBoardGameTransform = GTE.drawBoardGameTransformTmp;

	var w  = GTE.getRenderBoxWidth();
	var h  = GTE.getRenderBoxHeight();
	var x1 = GTE.renderBox[0];
	var y1 = GTE.renderBox[1];

	var posC = GTE.getTransformedCoordsInv(GTE.drawBoardGameTransform,x,y);
	console.log("["+posC[0].toFixed(2)+","+posC[1].toFixed(2)+"]");
	var pC = GTE.internalToRenderSpace(posC[0],posC[1]);

	var coords = GTE.levelCoords;
	var r = GTE.boardLevelRadius * (w+h)/2;
	for(var i = 0; i < coords.length; i++){
		var posL = GTE.internalToRenderSpace(coords[i][0],coords[i][1]);
		var pL = posL;
		// var pL   = GTE.getTransformedCoords(GTE.drawBoardGameTransform,posL[0],posL[1]);

		var unlocked = false;
		if(i > 0){
			var stars = GTE.userStats['level'+(i-1)];
			if(stars != null){
				if(stars.stars > 0){
					unlocked = true;
				}
			}
		}else{
			unlocked = true;
		}

		if(unlocked&&Math.pow(pC[0]-pL[0],2)+Math.pow(pC[1]-pL[1],2) < r*r){
			GTE.selectLevel(i);
			break;
		}
	}
};

GTE.boardMousemove = function(x,y){
	if(GTE.mouse == "down"){
		GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, x - GTE.mouseDownLast.x, y - GTE.mouseDownLast.y);
		GTE.dirtyCanvas = true;	
		GTE.mouseDownLast = {x:x,y:y};
	}
};


// *** Transforms ***
GTE.getTransformedCoords = function(t,x,y){
	var xNew = t[0]*x+t[1]*y+t[3];
	var yNew = t[4]*x+t[5]*y+t[7];

	return [xNew,yNew];
};

//TODO: make this actually inv
GTE.getTransformedCoordsInv = function(t,x,y){
	var xNew = x-t[3];
	var yNew = y-t[7];

	return [xNew,yNew];
};

GTE.transfromTranslate = function(t,x,y){
	var newT = t.slice(0);
	newT[3] += x;
	newT[7] += y;

	var gameBox = GTE.drawBoardGameBox;

	var offX = -newT[3];
	var offY = -newT[7];

	offX = offX < gameBox[0]   ? gameBox[0]   : offX;
	offX = offX > gameBox[2]-1 ? gameBox[2]-1 : offX;

	offY = offY < gameBox[1]   ? gameBox[1]   : offY;
	offY = offY > gameBox[3]-1 ? gameBox[3]-1 : offY;

	newT[3] = -offX;
	newT[7] = -offY;

	return newT;
};


// *** Event binding ***
GTE.initEvents = function(){
	$(window).resize(function(){
		GTE.resizeToFit();
	});

	$(document).mouseup(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to internal coord system
		if(GTE.boardGameView){
			var internalPoint = GTE.renderToInternalSpace(x,y);
			GTE.boardMouseup(internalPoint[0],internalPoint[1]);
		}else{
			var internalPoint = GTE.gameRenderToInternalSpace(x,y);
			GTE.mouseup(internalPoint[0],internalPoint[1]);
		}
	});

	document.addEventListener('touchend', function(e) {
		e.preventDefault();
		for(var i = 0; i < e.changedTouches.length; i++){
			var touch = e.changedTouches[i];
			// console.log("End: " + touch.identifier);
			if(!touch){continue;}

			var offset = $(GTE.canvasID).offset();
			var x = touch.pageX - offset.left;
			var y = touch.pageY - offset.top;

			if(GTE.boardGameView){
				var internalPoint = GTE.renderToInternalSpace(x,y);
				GTE.boardMouseup(internalPoint[0],internalPoint[1],touch.identifier);
			}else{
				var internalPoint = GTE.gameRenderToInternalSpace(x,y);
				GTE.mouseup(internalPoint[0],internalPoint[1],touch.identifier);
			}
		}
	}, false);

	$(document).mousedown(function (e) {
		if("#"+e.target.id !== GTE.canvasID){
			return;
		}

		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;
		//Convert to internal coord system
		if(GTE.boardGameView){
			var internalPoint = GTE.renderToInternalSpace(x,y);
			GTE.boardMousedown(internalPoint[0],internalPoint[1]);
		}else{
			var internalPoint = GTE.gameRenderToInternalSpace(x,y);
			GTE.mousedown(internalPoint[0],internalPoint[1]);
		}
	});

	document.addEventListener('touchstart', function(e) {
		e.preventDefault();

		for(var i = 0; i < e.touches.length; i++){
			var touch = e.touches[i];
			if(!touch){continue;}

			var offset = $(GTE.canvasID).offset();
			var x = touch.pageX - offset.left;
			var y = touch.pageY - offset.top;

			if(GTE.boardGameView){
				var internalPoint = GTE.renderToInternalSpace(x,y);
				GTE.boardMousedown(internalPoint[0],internalPoint[1],touch.identifier);
			}else{
				var internalPoint = GTE.gameRenderToInternalSpace(x,y);
				GTE.mousedown(internalPoint[0],internalPoint[1],touch.identifier);
			}
		}
	}, false);

	$(document).mousemove(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to intenal coord system
		if(GTE.boardGameView){
			var internalPoint = GTE.renderToInternalSpace(x,y);
			GTE.boardMousemove(internalPoint[0],internalPoint[1]);
		}else{
			var internalPoint = GTE.gameRenderToInternalSpace(x,y);
			GTE.mousemove(internalPoint[0],internalPoint[1]);
		}
	});

	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
		
		for(var i = 0; i < e.touches.length; i++){
			var touch = e.touches[i];
			if(!touch){continue;}
			// console.log(touch.identifier);

			var offset = $(GTE.canvasID).offset();
			var x = touch.pageX - offset.left;
			var y = touch.pageY - offset.top;

			if(GTE.boardGameView){
				var internalPoint = GTE.renderToInternalSpace(x,y);
				GTE.boardMousemove(internalPoint[0],internalPoint[1],touch.identifier);
			}else{
				var internalPoint = GTE.gameRenderToInternalSpace(x,y);
				GTE.mousemove(internalPoint[0],internalPoint[1],touch.identifier);
			}
		}
	}, false);

	$(document).keydown(function (e) {
		console.log("keypress: ", e.which);
		//112 = 'p'
		//114 = 'r'
		//115 = 's'
		// 37 - left 65 - a
		// 38 - up  87 - w
		// 39 - right 68 - d
		// 40 - down 83 - s

		if(GTE.boardGameView){
			if(e.which == 37 || e.which == 65){
				GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, 0.05, 0);
				GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
				GTE.saveGameState();
				GTE.dirtyCanvas = true;
			}else if(e.which == 39 || e.which == 68){
				GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, -0.05, 0);
				GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
				GTE.saveGameState();
				GTE.dirtyCanvas = true;
			}else if(e.which == 38 || e.which == 87){
				GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, 0, 0.05);
				GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
				GTE.saveGameState();
				GTE.dirtyCanvas = true;
			}else if(e.which == 40 || e.which == 83){
				GTE.drawBoardGameTransform = GTE.transfromTranslate(GTE.drawBoardGameTransform, 0,-0.05);
				GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
				GTE.saveGameState();
				GTE.dirtyCanvas = true;
			}
			

		}else{
			if(e.which == 37 && GTE.playingLevel){
				GTE.clickGroup(1);
			}else if(e.which == 39 && GTE.playingLevel){
				GTE.clickGroup(2);
			}else if(e.which == 81){
				GTE.openMenu();
			}
		}

	});
};

// *** Helper functions *** //

GTE.arrayColorToString = function(color){
	return "rgb("+Math.round(color[0])+","+Math.round(color[1])+","+Math.round(color[2])+")";
};

GTE.getRenderBoxWidth  = function(){return GTE.renderBox[2] - GTE.renderBox[0];};
GTE.getRenderBoxHeight = function(){return GTE.renderBox[3] - GTE.renderBox[1];};

// *** Fonts ***
// WebFontConfig = {
// 	google: { families: [ 'Libre+Baskerville::latin' ] },
// 	active: function() {
// 		GTE.font = "Libre Baskerville";
// 		GTE.dirtyCanvas = true;
// 	}
//   };
//   (function() {
//     var wf = document.createElement('script');
//     wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
//       '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
//     wf.type = 'text/javascript';
//     wf.async = 'true';
//     var s = document.getElementsByTagName('script')[0];
//     s.parentNode.insertBefore(wf, s);
//   })();

// *** LocalStorage Check ***
function supports_html5_storage() {
	try {
		return 'localStorage' in window && window['localStorage'] !== null;
	} catch (e) {
		return false;
	}
}



// Reprinted from Core HTML5 Canvas
// By David Geary
window.requestNextAnimationFrame =
   (function () {
      var originalWebkitRequestAnimationFrame = undefined,
          wrapper = undefined,
          callback = undefined,
          geckoVersion = 0,
          userAgent = navigator.userAgent,
          index = 0,
          self = this;

      // Workaround for Chrome 10 bug where Chrome
      // does not pass the time to the animation function
      
      if (window.webkitRequestAnimationFrame) {
         // Define the wrapper

         wrapper = function (time) {
           if (time === undefined) {
              time = +new Date();
           }
           self.callback(time);
         };

         // Make the switch
          
         originalWebkitRequestAnimationFrame = window.webkitRequestAnimationFrame;    

         window.webkitRequestAnimationFrame = function (callback, element) {
            self.callback = callback;

            // Browser calls the wrapper and wrapper calls the callback
            
            originalWebkitRequestAnimationFrame(wrapper, element);
         }
      }

      // Workaround for Gecko 2.0, which has a bug in
      // mozRequestAnimationFrame() that restricts animations
      // to 30-40 fps.

      if (window.mozRequestAnimationFrame) {
         // Check the Gecko version. Gecko is used by browsers
         // other than Firefox. Gecko 2.0 corresponds to
         // Firefox 4.0.
         
         index = userAgent.indexOf('rv:');

         if (userAgent.indexOf('Gecko') != -1) {
            geckoVersion = userAgent.substr(index + 3, 3);

            if (geckoVersion === '2.0') {
               // Forces the return statement to fall through
               // to the setTimeout() function.

               window.mozRequestAnimationFrame = undefined;
            }
         }
      }
      
      return window.requestAnimationFrame   ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame    ||
         window.oRequestAnimationFrame      ||
         window.msRequestAnimationFrame     ||

         function (callback, element) {
            var start,
                finish;


            window.setTimeout( function () {
               start = +new Date();
               callback(start);
               finish = +new Date();

               self.timeout = 1000 / 60 - (finish - start);

            }, self.timeout);
         };
      }
   )
();
