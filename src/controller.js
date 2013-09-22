//GTE vars
var GTE = {};

GTE.canvasID = "#gameCanvas";

//Timing (ms)
GTE.startTime = (new Date()).getTime();
GTE.lastFrameTime = 0;
GTE.frameRenderTime = 0;
GTE.startNewLevelAnimationTime = 0;
GTE.startEndLevelAnimationTime = 0;
GTE.newLevelAnimationTime = 500;
GTE.endLevelAnimationTime = 2000;
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
GTE.startNewLevelAnimation = false;
GTE.startEndLevelAnimation = false;
GTE.animatingNewLevel = false;
GTE.animatingEndLevel = false;
GTE.playingLevel = true;
GTE.boardGameView = true;
GTE.levelCompleted = false;


GTE.drawBoardGameBox = [-0.1,-1,1.1,1.1];

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

//TODO: localstorage this
GTE.userStats = {
	//'level0' : {'stars':2},
	// 'level1' : {'stars':3},
	// 'level2' : {'stars':1},
};

GTE.levelState = {};
GTE.lastWon = true;

//Mouse state
GTE.mouse = "up";
GTE.mouseDownIndex = -1;
GTE.mouseDownPos = {x:0,y:0};

var kongregate = parent.kongregate;

GTE.buttons = [
	{'name':'group1','box': [0.1,0.05,0.25,0.15]},
	{'name':'group2','box': [1.75,0.05,1.9,0.15]}
	]

GTE.main = function(){
	GTE.startSession();
	requestNextAnimationFrame(GTE.gameLoop);
};

window.onload = GTE.main;

GTE.gameLoop = function(time){
	var ctx = GTE.ctx;

	if(time - GTE.lastFrameTime > 5000){GTE.lastFrameTime = time-100;}

	if(GTE.startNewLevelAnimation){
		GTE.startNewLevelAnimation = false;
		GTE.animatingNewLevel = true;
		GTE.startNewLevelAnimationTime = time;
		GTE.dirtyCanvas = true;
	}
	if(GTE.animatingNewLevel && time - GTE.startNewLevelAnimationTime > GTE.newLevelAnimationTime){
		GTE.animatingNewLevel = false;
	}


	if(GTE.startEndLevelAnimation){
		GTE.startEndLevelAnimation = false;
		GTE.animatingEndLevel = true;
		GTE.startEndLevelAnimationTime = time;
		GTE.dirtyCanvas = true;
	}
	if(GTE.animatingEndLevel && time - GTE.startEndLevelAnimationTime > GTE.endLevelAnimationTime){
		GTE.animatingEndLevel = false;

		if(GTE.levelCompleted){
			GTE.viewBoard();
		}else{
			GTE.startNewLevel();
		}
	}

	if(GTE.boardGameView){
		GTE.animatingEndLevel = false;
		GTE.animatingNewLevel = false;
	}

	if(GTE.animatingEndLevel || GTE.boardGameView){
	}else{
		GTE.updateModel(time - GTE.lastFrameTime);
	}

	if(GTE.dirtyCanvas){

		GTE.dirtyCanvas = false;
		GTE.drawGame();

		//New level animation
		if(GTE.animatingNewLevel){
			GTE.newLevelAnimation(time - GTE.startNewLevelAnimationTime);
			GTE.dirtyCanvas = true;
		}else if(GTE.animatingEndLevel){
			GTE.endLevelAnimation(time - GTE.startEndLevelAnimationTime);
			GTE.dirtyCanvas = true;
		}

		//check if won game
		if(GTE.checkWon && !GTE.wonGame){
			GTE.checkWon = false;
			if(false){
				GTE.winGame();
			}
		}
		
		//Save game
		if(GTE.toSaveGame){
			GTE.saveGameState();
			GTE.toSaveGame = false;
		}
	}

	if(time - GTE.lastUIUpdateTime > GTE.UIUpdateTime){
		GTE.updateUI();
	}

	requestNextAnimationFrame(GTE.gameLoop);

	GTE.frameRenderTime = time - GTE.lastFrameTime;
	GTE.lastFrameTime = time;

};

GTE.startGame = function(){
	GTE.dirtyCanvas = true;
	GTE.wonGame = false;

	GTE.startNewLevelAnimation = true;

	GTE.saveGameState();
};


GTE.loadGameState = function() {
	if (!supports_html5_storage()) { return false; }
	GTE.gameInProgress = (localStorage["GTE.gameInProgress"] == "true");

	if(GTE.gameInProgress){
		GTE.userStats    = JSON.parse(localStorage["GTE.userStats"]);
		GTE.level        = parseInt(localStorage["GTE.level"]);
		GTE.stage        = parseInt(localStorage["GTE.stage"]);
		GTE.stagesWon    = parseInt(localStorage["GTE.stagesWon"]);
		GTE.stagesLost   = parseInt(localStorage["GTE.stagesLost"]);
		GTE.boardGameView = parseInt(localStorage["GTE.boardGameView"]);	
		GTE.levelState    = JSON.parse(localStorage["GTE.levelState"]);
		if(GTE.boardGameView === 0){
			GTE.levelSettings = JSON.parse(localStorage["GTE.levelSettings"]);
			GTE.playingLevel = parseInt(localStorage["GTE.playingLevel"]);	
		}
	}
}

GTE.saveGameState = function() {
	if (!supports_html5_storage()) { return false; }
	localStorage["GTE.gameInProgress"] = true; //temp disable for testing

	localStorage["GTE.userStats"]     = JSON.stringify(GTE.userStats);
	localStorage["GTE.levelState"]    = JSON.stringify(GTE.levelState);
	localStorage["GTE.levelSettings"] = JSON.stringify(GTE.levelSettings);
	localStorage["GTE.level"]         = GTE.level;
	localStorage["GTE.stagesWon"]     = GTE.stagesWon;
	localStorage["GTE.stagesLost"]    = GTE.stagesLost;
	localStorage["GTE.stage"]         = GTE.stage;
	localStorage["GTE.boardGameView"] = GTE.boardGameView == true ? 1 : 0;
	localStorage["GTE.playingLevel"]  = GTE.playingLevel == true ? 1 : 0;
}

GTE.startSession = function(){
	GTE.loadGameState();

	GTE.canvas = $(GTE.canvasID)[0];
	GTE.ctx = GTE.canvas.getContext("2d");
	
	var w = GTE.canvas.width;
	var h = GTE.canvas.height;

	GTE.renderBox = [20,20,w-20,h-20];
	
	//GTE.startNewLevel();
	// GTE.viewBoard();


	//Start new game
	if(!GTE.gameInProgress){
		GTE.startGame();
	}

	GTE.dirtyCanvas = true;

	GTE.initEvents();
}

GTE.mousemove = function(x,y){
	if(GTE.mouse === "down"){
		if(GTE.mouseDownIndex >= 0){
			GTE.updateMouseForce(0,x,y);
		}
	}
};

GTE.mousedown = function(x,y){
	GTE.mouse = "down";
	GTE.mouseDownPos = {x:x,y:y};
	GTE.mouseDownIndex = -1;

	for(var i = 0; i < GTE.buttons.length; i++){
		var button = GTE.buttons[i];
	
		if(x >= button.box[0] && x <= button.box[2] && y >= button.box[1] && y <= button.box[3]){
			if(button.name == "group1"){
				GTE.clickGroup(1);
				return;
			}else{
				GTE.clickGroup(2);
				return;
			}
		}
	}

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		if((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y) < p.r*p.r){
			GTE.mouseDownIndex = p.id;

			//idForces for possible multitouch ability in future
			GTE.createMouseForce(0,i,x,y);
			break;
		}
	}
};

GTE.mouseup = function(x,y){
	GTE.mouse = "up";

	if(GTE.mouseDownIndex >= 0){
		GTE.destroyMouseForce(0,x,y);
	}
};

GTE.clickGroup = function(groupID){

	if(GTE.playingLevel){
		var winningGroup = GTE.getGTEGroup();

		if(winningGroup == groupID || winningGroup == 0){
			GTE.winLevel();
		}else{
			GTE.loseLevel();
		}
	}
};

GTE.winLevel = function(){
	console.log("Win!");
	GTE.lastWon = true;

	GTE.stagesWon++;
	GTE.stage++;

	GTE.endLevel();
};

GTE.loseLevel = function(){
	console.log("Lose!");
	GTE.lastWon = false;

	GTE.stagesLost++;
	GTE.stage++;

	GTE.endLevel();
};

GTE.endLevel = function(){

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

		GTE.stage      = 0;
		GTE.stagesLost = 0;
		GTE.stagesWon  = 0;
		GTE.levelCompleted = true;
	}else{
		GTE.levelCompleted = false;
	}

	GTE.saveGameState();
	GTE.updateHUD();

	GTE.playingLevel = false;
	GTE.startEndLevelAnimation = true;
	GTE.dirtyCanvas = true;
};

GTE.viewBoard = function(){
	GTE.boardGameView = true;
	GTE.dirtyCanvas = true;
	GTE.playingLevel = false;
	GTE.saveGameState();
};

GTE.startNewLevel = function(){	
	GTE.playingLevel = true;
	GTE.initModel();
	GTE.updateHUD();
	GTE.boardGameView = false;
	GTE.dirtyCanvas = true;
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
	GTE.startGame();
};

GTE.selectLevel = function(i){
	GTE.level = i;
	GTE.startNewLevel();
}

// *** Board View Events ***
GTE.boardMouseup = function(x,y){
	GTE.mouse = "up";

	GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;
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
	var pC = GTE.internalToRenderSpace(posC[0]*2,posC[1]);

	var coords = GTE.levelCoords;
	var r = GTE.boardLevelRadius * (w+h)/2;
	for(var i = 0; i < coords.length; i++){
		var posL = GTE.internalToRenderSpace(coords[i][0]*2,coords[i][1]);
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
	$(document).mouseup(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to internal coord system
		var internalPoint = GTE.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];

		if(GTE.boardGameView){
			GTE.boardMouseup(x/2,y);
		}else{
			GTE.mouseup(x,y);
		}
	});

	$(document).mousedown(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to internal coord system
		var internalPoint = GTE.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];
			
		if(GTE.boardGameView){
			GTE.boardMousedown(x/2,y);
		}else{
			GTE.mousedown(x,y);
		}
	});

	$(document).mousemove(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to intenal coord system
		var internalPoint = GTE.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];

		if(GTE.boardGameView){
			GTE.boardMousemove(x/2,y);
		}else{
			GTE.mousemove(x,y);
		}
	});

	$(document).keydown(function (e) {
		console.log("keypress: ", e.which);
		//112 = 'p'
		//114 = 'r'
		//115 = 's'
		// 37 - left
		// 38 - up
		// 39 - right
		// 40 - down
		if(e.which == 37 && GTE.playingLevel){
			GTE.clickGroup(1);
		}else if(e.which == 39 && GTE.playingLevel){
			GTE.clickGroup(2);
		}else if(e.which == 81){
			GTE.viewBoard();
		}

	});
};

// *** Helper functions *** //
GTE.internalToRenderSpace = function(x,y){
	var xRender = x / 2 * GTE.getRenderBoxWidth()  + GTE.renderBox[0];
	var yRender = y * GTE.getRenderBoxHeight() + GTE.renderBox[1];
	return [xRender,yRender];
};

GTE.renderToInternalSpace = function(x,y){
	var xInternal = 2*(x - GTE.renderBox[0]) / GTE.getRenderBoxWidth();
	var yInternal = (y - GTE.renderBox[1]) / GTE.getRenderBoxHeight();
	return [xInternal,yInternal];
};

GTE.arrayColorToString = function(color){
	return "rgb("+Math.round(color[0])+","+Math.round(color[1])+","+Math.round(color[2])+")";
};

GTE.getRenderBoxWidth  = function(){return GTE.renderBox[2] - GTE.renderBox[0];};
GTE.getRenderBoxHeight = function(){return GTE.renderBox[3] - GTE.renderBox[1];};

// *** Fonts ***
WebFontConfig = {
	google: { families: [ 'Libre+Baskerville::latin' ] },
	active: function() {
		GTE.font = "Libre Baskerville";
		GTE.dirtyCanvas = true;
	}
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

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
