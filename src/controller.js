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

GTE.maxLevel = 1;
GTE.level = GTE.maxLevel;
GTE.levelState = {};
GTE.lastWon = true;
GTE.gameDifficulty = 0;

//Mouse state
GTE.mouse = "up";
GTE.mouseDownIndex = -1;
GTE.mouseDownPos = {x:0,y:0};

var kongregate = parent.kongregate;

GTE.buttons = [
	{'name':'group1','box': [0.25,0.1,0.50,0.2]},
	{'name':'group2','box': [1.50,0.1,1.75,0.2]}
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
		GTE.startNewLevel();
	}

	if(!GTE.animatingEndLevel){
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
		GTE.maxLevel = parseInt(localStorage["GTE.maxLevel"]);
		GTE.wonGame = (localStorage["GTE.wonGame"] == "true");
		GTE.level = parseInt(localStorage["GTE.level"]);
	}
}

GTE.saveGameState = function() {
	if (!supports_html5_storage()) { return false; }
	// localStorage["GTE.gameInProgress"] = true; //temp disable for testing

	localStorage["GTE.maxLevel"] = GTE.maxLevel;
	localStorage["GTE.wonGame"] = GTE.wonGame;
	localStorage["GTE.level"] = GTE.level;
}

GTE.startSession = function(){
	GTE.canvas = $(GTE.canvasID)[0];
	GTE.ctx = GTE.canvas.getContext("2d");
	
	var w = GTE.canvas.width;
	var h = GTE.canvas.height;

	GTE.renderBox = [20,20,w-20,h-20];
	
	GTE.initModel();

	GTE.loadGameState();

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
			GTE.createMouseForce(0,p.id,x,y);
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

	var winningGroup = GTE.getGTEGroup();

	if(winningGroup == groupID || winningGroup == 0){
		GTE.winLevel();
	}else{
		GTE.loseLevel();
	}
};

GTE.winLevel = function(){
	console.log("Win!");
	GTE.lastWon = true;
	GTE.gameDifficulty += 1;
	GTE.endLevel();
};

GTE.loseLevel = function(){
	console.log("Lose!");
	GTE.gameDifficulty -= 2;
	if(GTE.gameDifficulty < 0){GTE.gameDifficulty = 0;}
	GTE.lastWon = false;
	GTE.endLevel();
};

GTE.endLevel = function(){
	GTE.startEndLevelAnimation = true;
	GTE.dirtyCanvas = true;
};

GTE.startNewLevel = function(){	
	GTE.initModel();
	GTE.dirtyCanvas = true;
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

		GTE.mouseup(x,y);
	});

	$(document).mousedown(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to internal coord system
		var internalPoint = GTE.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];
		
		GTE.mousedown(x,y);
	});

	$(document).mousemove(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to intenal coord system
		var internalPoint = GTE.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];

		GTE.mousemove(x,y);
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
		if(e.which == 37){
			GTE.clickGroup(1);
		}else if(e.which == 39){
			GTE.clickGroup(2);
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
