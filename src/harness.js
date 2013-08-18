//JSPG vars
var JSPG = {}; //Joe's Shortest Path Game

var kongregate = parent.kongregate;

JSPG.startTime = (new Date()).getTime();
JSPG.clockTime = 0;
JSPG.lastFrameTime = 0;
JSPG.fps = 0;
JSPG.startNewLevelAnimationTime = 0;
JSPG.newLevelAnimationTime = 500;

JSPG.UIFreq = 10;
JSPG.lastUIUpdateTime = 0;

JSPG.mouse = "up";

JSPG.renderBox = [0,0,0,0];

JSPG.editValueAmount = 20;

JSPG.maxLevel = 1;
JSPG.level = JSPG.maxLevel;
JSPG.map = {};

JSPG.font = 'Verdana'; //Default font before new one loaded

//State bools
JSPG.dirtyCanvas = true;  //Keep track of when state has changed and need to update canvas
JSPG.gameInProgress = false;
JSPG.wonGame = false;
JSPG.toSaveGame = true;
JSPG.startNewLevelAnimation = false;
JSPG.animatingNewLevel = false;

JSPG.lastMouseDownIndex = -1;

JSPG.mouseAction = "add";

window.onload = function(){
	JSPG.startSession();
	requestNextAnimationFrame(JSPG.animate);
};

JSPG.animate = function(time){

	var ctx = JSPG.ctx;
	
	if(JSPG.startNewLevelAnimation){
		JSPG.startNewLevelAnimation = false;
		JSPG.animatingNewLevel = true;
		JSPG.startNewLevelAnimationTime = time;
		JSPG.dirtyCanvas = true;
	}

	if(JSPG.animatingNewLevel && time - JSPG.startNewLevelAnimationTime > JSPG.newLevelAnimationTime){
		JSPG.animatingNewLevel = false;
	}

	if(JSPG.dirtyCanvas){

		JSPG.dirtyCanvas = false;

		JSPG.drawBackground();

		JSPG.drawGame();

		if(JSPG.animatingNewLevel){
			JSPG.newLevelAnimation(time - JSPG.startNewLevelAnimationTime);
			JSPG.dirtyCanvas = true;
		}

		if(JSPG.checkWon && !JSPG.wonGame){
			JSPG.checkWon = false;
			//check if won game
			if(JSPG.pathEqualsPath(JSPG.map.goalPath,JSPG.map.shortestPath)){
				
				JSPG.winGame();
			}
		}

		if(time - JSPG.lastUIUpdateTime > 1000/JSPG.UIFreq){
			$('#fps').text("FPS: "+(JSPG.fps+0.5|0));
			$('#score').text("Score: "+JSPG.totalAdded);
		}

		console.log("animate! fps: " + (JSPG.fps+0.5|0));
		
		//Save game
		if(JSPG.toSaveGame){
			JSPG.saveGameState();
			JSPG.toSaveGame = false;
		}
	}

	requestNextAnimationFrame(JSPG.animate);

	JSPG.fps = 1000 / (time - JSPG.lastFrameTime);
	JSPG.lastFrameTime = time;

};

JSPG.startGame = function(){
	JSPG.map = {};
	JSPG.dirtyCanvas = true;
	JSPG.wonGame = false;

	//JSPG.map = JSPG.createMap();
	JSPG.map = JSON.parse(JSPG.levels['level'+JSPG.level]);
	JSPG.map.goalPath = JSPG.buildGoalPath(JSPG.map);
	//console.log(JSPG.map.goalPath,JSPG.map.shortestPath);

	JSPG.startNewLevelAnimation = true;
	JSPG.totalAdded = 0;

	JSPG.saveGameState();
};

JSPG.loadGameState = function() {
	if (!supports_html5_storage()) { return false; }
	JSPG.gameInProgress = (localStorage["JSPG.gameInProgress"] == "true");

	if(JSPG.gameInProgress){
		JSPG.maxLevel = parseInt(localStorage["JSPG.maxLevel"]);
		JSPG.wonGame = (localStorage["JSPG.wonGame"] == "true");
		JSPG.level = parseInt(localStorage["JSPG.level"]);
		JSPG.map = JSON.parse(localStorage["JSPG.map"]);
	}
}

JSPG.saveGameState = function() {
	if (!supports_html5_storage()) { return false; }
	// localStorage["JSPG.gameInProgress"] = true; //temp disable for testing

	localStorage["JSPG.maxLevel"] = JSPG.maxLevel;
	localStorage["JSPG.wonGame"] = JSPG.wonGame;
	localStorage["JSPG.level"] = JSPG.level;

	localStorage["JSPG.map"] = JSON.stringify(JSPG.map);
}

JSPG.startSession = function(){
	JSPG.canvas = document.getElementById("gameCanvas");
	JSPG.ctx = JSPG.canvas.getContext("2d");
	
	var w = JSPG.canvas.width;
	var h = JSPG.canvas.height;

	JSPG.renderBox = [20,20,w-20,h-20];

	JSPG.loadGameState();

	//Start new game
	if(!JSPG.gameInProgress){
		JSPG.startGame();
	}

	JSPG.dirtyCanvas = true;

	JSPG.initEvents();
}

JSPG.internalToRenderSpace = function(x,y){
	var xRender = x * JSPG.getRenderBoxWidth()  + JSPG.renderBox[0];
	var yRender = y * JSPG.getRenderBoxHeight() + JSPG.renderBox[1];
	return [xRender,yRender];
};

JSPG.renderToInternalSpace = function(x,y){
	var xInternal = (x - JSPG.renderBox[0]) / JSPG.getRenderBoxWidth();
	var yInternal = (y - JSPG.renderBox[1]) / JSPG.getRenderBoxHeight();
	return [xInternal,yInternal];
};

JSPG.arrayColorToString = function(color){
	return "rgb("+Math.round(color[0])+","+Math.round(color[1])+","+Math.round(color[2])+")";
};

JSPG.getRenderBoxWidth  = function(){return JSPG.renderBox[2] - JSPG.renderBox[0];};
JSPG.getRenderBoxHeight = function(){return JSPG.renderBox[3] - JSPG.renderBox[1];};
JSPG.mouseDown = function(){return JSPG.mouse === "down";};
JSPG.mouseUp = function(){return JSPG.mouse === "up";};


JSPG.drawGame = function(){
	JSPG.drawMap();
	JSPG.drawPath(JSPG.map.shortestPath,"current");
	JSPG.drawPath(JSPG.map.goalPath,"goal");
};

JSPG.drawMap = function(){
	var ctx = JSPG.ctx;
	ctx.save();

	var w = JSPG.canvas.width;
	var h = JSPG.canvas.height;

	var renderWidth  = JSPG.getRenderBoxWidth();
	var renderHeight = JSPG.getRenderBoxHeight();

	var boxWidth = renderWidth / JSPG.map.w;
	var boxHeight = renderHeight / JSPG.map.h;

	var xStart = JSPG.renderBox[0];
	var yStart = JSPG.renderBox[1];

	var x,y;
	var index;
	var color,tileValue,tileType;

	for(y = 0; y < JSPG.map.h; y++){
		for(x = 0; x < JSPG.map.w; x++){
			index = x+y*JSPG.map.w;
			xDraw = xStart + x * boxWidth;
			yDraw = yStart + y * boxHeight;

			tileValue = JSPG.map.tiles[index].value;
			tileType  = JSPG.map.tiles[index].type;

			color = [2.55*tileValue,0,0];

			if(tileType == "start"){
				color = [0,0,255];
			}else if(tileType == "finish"){
				color = [0,0,255];
			}else if(tileType == "goal"){
				//color = [2.55*tileValue,255,0];
			}

			ctx.fillStyle = JSPG.arrayColorToString(color);

			ctx.fillRect(xDraw,yDraw,boxWidth,boxHeight);
		}
	}

	ctx.restore();
};

JSPG.drawPath = function(path,pathType){

	if(typeof path !== "object" || path.length <= 0){return;}
	var ctx = JSPG.ctx;
	ctx.save();

	var w = JSPG.canvas.width;
	var h = JSPG.canvas.height;

	var renderWidth  = JSPG.getRenderBoxWidth();
	var renderHeight = JSPG.getRenderBoxHeight();

	var boxWidth = renderWidth / JSPG.map.w;
	var boxHeight = renderHeight / JSPG.map.h;

	var xStart = JSPG.renderBox[0];
	var yStart = JSPG.renderBox[1];

	ctx.beginPath();

	var x = path[0][0];
	var y = path[0][1];
	var index = x+y*JSPG.map.w;
	var xDraw = xStart + (x+0.5) * boxWidth;
	var yDraw = yStart + (y+0.5) * boxHeight;
	ctx.moveTo(xDraw+0.5,yDraw+0.5);

	var i;
	for(i = 1; i < path.length; i++){
		x = path[i][0];
		y = path[i][1];
		index = x+y*JSPG.map.w;
		xDraw = xStart + (x+0.5) * boxWidth;
		yDraw = yStart + (y+0.5) * boxHeight;

		if(pathType === "goal"){
			ctx.strokeStyle = 'rgba(0,150,0,0.5)';
			ctx.lineTo(xDraw+0.5,yDraw+0.5);
		}else{
			ctx.strokeStyle = 'white';
			ctx.lineTo(xDraw+0.5,yDraw+0.5);
		}
	}

	//ctx.closePath();
	ctx.lineWidth = 3;
	ctx.stroke();

	ctx.restore();
};

JSPG.newLevelAnimation = function(time){
	var ctx = JSPG.ctx;
	ctx.save();

	ctx.fillStyle = 'rgba(0,150,0,'+(1-time/JSPG.newLevelAnimationTime)+')';

	//Box border
	ctx.beginPath();
    ctx.moveTo(JSPG.renderBox[0]-0.5,JSPG.renderBox[1]-0.5);
    ctx.lineTo(JSPG.renderBox[0]-0.5,JSPG.renderBox[3]+0.5);
    ctx.lineTo(JSPG.renderBox[2]+0.5,JSPG.renderBox[3]+0.5);
    ctx.lineTo(JSPG.renderBox[2]+0.5,JSPG.renderBox[1]-0.5);
    ctx.lineTo(JSPG.renderBox[0]-0.5,JSPG.renderBox[1]-0.5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();	
};

JSPG.mousemove = function(x,y){
	var w = JSPG.map.w;
	var h = JSPG.map.h;

	var tileIndex = (x*w|0)+w*(y*h|0);

	if(JSPG.mouse === "down" && tileIndex != JSPG.lastMouseDownIndex){
		JSPG.mousedown(x,y);
	}

};

JSPG.mousedown = function(x,y){
	JSPG.mouse = "down";

	var w = JSPG.map.w;
	var h = JSPG.map.h;

	var tiles = JSPG.map.tiles;
	var tileIndex = (x*w|0)+w*(y*h|0);
	console.log(tiles[tileIndex].value);

	JSPG.lastMouseDownIndex = tileIndex;
	if(JSPG.mouseAction == "add"){
		tiles[tileIndex].value += JSPG.editValueAmount;
		JSPG.totalAdded += JSPG.editValueAmount;
	}else if(JSPG.mouseAction == "subtract"){
		tiles[tileIndex].value -=  JSPG.editValueAmount;
		if(tiles[tileIndex].value < 0){
			tiles[tileIndex].value = 0;
		}
	}else if(JSPG.mouseAction == "goal"){
		if(tiles[tileIndex].type == "goal"){
			tiles[tileIndex].type = "normal";
		}else{
			tiles[tileIndex].type = "goal";
		}
	}

	JSPG.dirtyCanvas = true;
	JSPG.checkWon = true;
	JSPG.toSaveGame = true;
	JSPG.map.shortestPath = JSPG.findShortestPath();

};

JSPG.mouseup = function(x,y){
	JSPG.mouse = "up";
	
};

JSPG.drawBackground = function(){
	var ctx = JSPG.ctx;
	ctx.save();

	ctx.clearRect(0,0,JSPG.canvas.width,JSPG.canvas.height);

	var grd;

	grd = ctx.createLinearGradient(JSPG.renderBox[0],JSPG.renderBox[1],JSPG.getRenderBoxWidth(),JSPG.getRenderBoxHeight()/2);
	grd.addColorStop(0, 'rgb(149,215,236)');
	grd.addColorStop(1, 'rgb(29,141,178)');

	ctx.fillStyle = grd;
	ctx.fillRect(JSPG.renderBox[0],JSPG.renderBox[1],JSPG.getRenderBoxWidth(),JSPG.getRenderBoxHeight());		

	//Box border
	ctx.beginPath();
    ctx.moveTo(JSPG.renderBox[0]-0.5,JSPG.renderBox[1]-0.5);
    ctx.lineTo(JSPG.renderBox[0]-0.5,JSPG.renderBox[3]+0.5);
    ctx.lineTo(JSPG.renderBox[2]+0.5,JSPG.renderBox[3]+0.5);
    ctx.lineTo(JSPG.renderBox[2]+0.5,JSPG.renderBox[1]-0.5);
    ctx.lineTo(JSPG.renderBox[0]-0.5,JSPG.renderBox[1]-0.5);
    ctx.closePath();
    ctx.strokeStyle = '000';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
};

JSPG.winGame = function(){
	if(JSPG.level == JSPG.maxLevel){
		JSPG.maxLevel++;

		if(typeof kongregate !== "undefined"){
			kongregate.stats.submit("Max Level",JSPG.maxLevel-4);
		}

	}

	JSPG.level++;

	console.log("you win!");
	JSPG.wonGame = true;
	JSPG.startGame();
};


// *** Events ***
JSPG.initEvents = function(){
	$(document).mouseup(function (e) {
		var offset = $("#gameCanvas").offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to internal coord system
		var internalPoint = JSPG.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];

		JSPG.mouseup(x,y);
	});

	$(document).mousedown(function (e) {
		var offset = $("#gameCanvas").offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to internal coord system
		var internalPoint = JSPG.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];
		
		JSPG.mousedown(x,y);
	});

	$(document).mousemove(function (e) {
		var offset = $("#gameCanvas").offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		//Convert to intenal coord system
		var internalPoint = JSPG.renderToInternalSpace(x,y);
		x = internalPoint[0];
		y = internalPoint[1];

		JSPG.mousemove(x,y);
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

		switch (e.which){
			case 38:
				JSPG.editValueAmount += 10;
			break;

			case 40:
				JSPG.editValueAmount -= 10;
				if(JSPG.editValueAmount < 10){
					JSPG.editValueAmount = 10;
				}
			break;
		}
	});


	$('#mouseAction').change(function() {
		JSPG.mouseAction = $(this).val();
	});
};

// *** Fonts ***
WebFontConfig = {
	google: { families: [ 'Libre+Baskerville::latin' ] },
	active: function() {
		JSPG.font = "Libre Baskerville";
		JSPG.dirtyCanvas = true;
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
