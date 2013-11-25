// Copyright (c) 2013 Joseph McCourt
"use strict";

//Power overwhelming
//There is no cow level

//Main namespace GTE
var GTE = {};
GTE.license = "Copyright (c) 2013 Joseph McCourt";

//Increase this when I introduce
//Change to localstorage state
GTE.stateVersion = "0.1.2";
GTE.maxLevel = 50;

GTE.userStats = {
	'level0' : {'stars':0}
};

GTE.unlockAllLevels = false;

GTE.canvasID = "#gameCanvas";

GTE.viewBoard = true;
GTE.viewLevel = false;

GTE.dirtyCanvas = true;

//Visual settings
GTE.font = 'Verdana';
GTE.renderBox = [0,0,0,0];

//Timing
GTE.lastFrameTime = 0;
GTE.frameRenderTime = 0;

//Mouse state
GTE.mouse = "up";
GTE.mouseDownPos = {x:0,y:0};
GTE.mouseDownLast = {x:0,y:0};

//Kongregate API integration
GTE.kongregate = parent.kongregate;

GTE.main = function(){
	GTE.startSession();

	GTE.soundsEnabled = window.hasOwnProperty('AudioContext');
	GTE.loadSounds();

	requestNextAnimationFrame(GTE.gameLoop);
};

window.onload = GTE.main;

GTE.startSession = function(){
	GTE.canvas = $(GTE.canvasID)[0];
	GTE.ctx = GTE.canvas.getContext("2d");

	GTE.setLevelRenderBox();
	
	GTE.loadGameState();
	
	if(GTE.levelCompleted){
		GTE.openMenu();
	}
	
	GTE.initAABBTree();
	GTE.drawBoardGameTransformTmp = GTE.drawBoardGameTransform;

	GTE.resizeToFit();

	GTE.dirtyCanvas = true;
	GTE.sanitizeButtons();
	GTE.initEvents();
};

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

		GTE.toStartNewStage = true;
		if(GTE.levelCompleted){
			GTE.openMenu();
		}else if(!GTE.menuView){
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

	if(GTE.viewLevel){
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
		}

		if(GTE.menuView){
			drawGameParams.phase = 'menu';
		}

		if(GTE.viewBoard){
			drawGameParams.phase = "board";
		}

		GTE.drawGame(drawGameParams);
	}

	requestNextAnimationFrame(GTE.gameLoop);

	GTE.frameRenderTime = time - GTE.lastFrameTime;
	GTE.lastFrameTime = time;
};

GTE.loadGameState = function(){
	if (!supports_html5_storage()) { return false; }
	
	var localStats = localStorage["GTE.userStats"];
	if(typeof localStats === "string"){GTE.userStats = JSON.parse(localStats);}

	var stateVersion = localStorage["GTE.stateVersion"] && JSON.parse(localStorage["GTE.stateVersion"]);

	//If different state version don't load any other state info
	//Changing state flags can break things
	if(stateVersion !== GTE.stateVersion){return;}

	GTE.renderBox    = JSON.parse(localStorage["GTE.renderBox"]);
	GTE.level        = parseInt(localStorage["GTE.level"]);
	GTE.stage        = parseInt(localStorage["GTE.stage"]);
	GTE.stagesWon    = parseInt(localStorage["GTE.stagesWon"]);
	GTE.stagesLost   = parseInt(localStorage["GTE.stagesLost"]);
	GTE.viewBoard    = parseInt(localStorage["GTE.viewBoard"]);	
	GTE.viewLevel    = parseInt(localStorage["GTE.viewLevel"]);	
	GTE.levelState   = JSON.parse(localStorage["GTE.levelState"]);
	GTE.drawBoardGameTransform = JSON.parse(localStorage['GTE.drawBoardGameTransform']);
	if(GTE.viewBoard === 0){
		GTE.levelSettings = JSON.parse(localStorage["GTE.levelSettings"]);
		GTE.playingLevel = parseInt(localStorage["GTE.playingLevel"]);	
		GTE.levelCompleted = parseInt(localStorage["GTE.levelCompleted"]);	
	}
};

GTE.saveGameState = function() {
	GTE.updateKongStats();

	if (!supports_html5_storage()) { return false; }
	localStorage["GTE.license"]       = GTE.license;
	localStorage["GTE.userStats"]     = JSON.stringify(GTE.userStats);
	localStorage["GTE.stateVersion"]  = JSON.stringify(GTE.stateVersion);
	localStorage["GTE.renderBox"]     = JSON.stringify(GTE.renderBox);
	localStorage["GTE.levelState"]    = JSON.stringify(GTE.levelState);
	localStorage["GTE.levelSettings"] = JSON.stringify(GTE.levelSettings);
	localStorage["GTE.drawBoardGameTransform"] = JSON.stringify(GTE.drawBoardGameTransform);
	localStorage["GTE.level"]         = GTE.level;
	localStorage["GTE.stagesWon"]     = GTE.stagesWon;
	localStorage["GTE.stagesLost"]    = GTE.stagesLost;
	localStorage["GTE.stage"]         = GTE.stage;
	localStorage["GTE.viewBoard"]     = GTE.viewBoard == true ? 1 : 0;
	localStorage["GTE.viewLevel"]     = GTE.viewLevel == true ? 1 : 0;
	localStorage["GTE.playingLevel"]  = GTE.playingLevel  == true ? 1 : 0;
	localStorage["GTE.levelCompleted"]  = GTE.levelCompleted  == true ? 1 : 0;
};

GTE.updateKongStats = function(){
	var kongregate = GTE.kongregate;
	if(typeof kongregate !== "undefined"){
		var maxLevel = -1; //Because we start at level 0
		var numStars = 0;

		var stats = GTE.userStats;
		for(var level in stats){
			if(stats.hasOwnProperty(level)){
				var stars = stats[level].stars;
				if(typeof stars !== "undefined"){
					numStars += stars;

					//This works as long as levels are in order
					if(numStars >= 1){
						maxLevel += 1;
					}
				}
			}
		}

		if(maxLevel < 0){maxLevel = 0;}
		kongregate.stats.submit("Max Level",maxLevel);
		kongregate.stats.submit("Total Stars",numStars);
	}
};

// *** Main Events *** //
GTE.mousemove = function(x,y,id){
	if(GTE.viewBoard){
		var internalPoint = GTE.renderToInternalSpace(x,y,id);
		GTE.mousemoveBoard(internalPoint[0],internalPoint[1]);
	}else{
		var internalPoint = GTE.gameRenderToInternalSpace(x,y);
		GTE.mousemoveLevel(internalPoint[0],internalPoint[1],id);
	}
};

GTE.mousedown = function(x,y,id){
	var internalPoint;
	if(GTE.viewBoard){
		internalPoint = GTE.renderToInternalSpace(x,y);
		GTE.mousedownBoard(internalPoint[0],internalPoint[1],id);
	}else{
		internalPoint = GTE.gameRenderToInternalSpace(x,y);
		GTE.mousedownLevel(internalPoint[0],internalPoint[1],id);
	}
};

GTE.mouseup = function(x,y,id){
	var internalPoint;
	if(GTE.viewBoard){
		internalPoint = GTE.renderToInternalSpace(x,y);
		GTE.mouseupBoard(internalPoint[0],internalPoint[1],id);
	}else{
		internalPoint = GTE.gameRenderToInternalSpace(x,y);
		GTE.mouseupLevel(internalPoint[0],internalPoint[1],id);
	}
};

GTE.keydown = function(e){
	if(GTE.viewBoard){
		GTE.keydownBoard(e.which);
	}else if(GTE.viewLevel){
		GTE.keydownLevel(e.which);
	}
};

// *** Event binding *** //
GTE.initEvents = function(){
	$(window).resize(function(){
		GTE.resizeToFit();
	});

	$(document).mouseup(function (e) {
		GTE.mouse = "up";
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		GTE.mouseup(x,y);
	});

	document.addEventListener('touchend', function(e) {
		GTE.mouse = "up";
		e.preventDefault();
		for(var i = 0; i < e.changedTouches.length; i++){
			var touch = e.changedTouches[i];
			if(!touch){continue;}

			var offset = $(GTE.canvasID).offset();
			var x = touch.pageX - offset.left;
			var y = touch.pageY - offset.top;

			GTE.mouseup(x,y,touch.identifier);
		}
	}, false);

	$(document).mousedown(function (e) {
		GTE.mouse = "down";
		if("#"+e.target.id !== GTE.canvasID){
			return;
		}

		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		GTE.mousedown(x,y);
	});

	document.addEventListener('touchstart', function(e) {
		GTE.mouse = "down";
		e.preventDefault();

		for(var i = 0; i < e.touches.length; i++){
			var touch = e.touches[i];
			if(!touch){continue;}

			var offset = $(GTE.canvasID).offset();
			var x = touch.pageX - offset.left;
			var y = touch.pageY - offset.top;

			GTE.mousedown(x,y,touch.identifier);
		}
	}, false);

	$(document).mousemove(function (e) {
		var offset = $(GTE.canvasID).offset();
		var x = e.pageX - offset.left;
		var y = e.pageY - offset.top;

		GTE.mousemove(x,y);
	});

	document.addEventListener('touchmove', function(e) {
		e.preventDefault();
		
		for(var i = 0; i < e.touches.length; i++){
			var touch = e.touches[i];
			if(!touch){continue;}

			var offset = $(GTE.canvasID).offset();
			var x = touch.pageX - offset.left;
			var y = touch.pageY - offset.top;

			GTE.mousemove(x,y,touch.identifier);
		}
	}, false);

	$(document).keydown(function (e) {
		GTE.keydown(e);
	});
};

GTE.canPlayLevel = function(level){
	if(level > GTE.maxLevel){return false;}
	if(level == 0 || GTE.unlockAllLevels){return true;}
	var prevLevel = GTE.userStats['level'+(level-1)];
	if(!prevLevel || prevLevel == null){return false}
	return prevLevel.stars > 0;
};

GTE.setView = function(view){
	if(view === "board"){
		GTE.viewBoard = true;
		GTE.viewLevel = false;

		GTE.dirtyCanvas = true;
		GTE.playingLevel = false;

		GTE.animatingEndStage = false;
		GTE.animatingNewStage = false;

		GTE.setBoardRenderBox();
		GTE.saveGameState();
	}else if(view === "level"){
		GTE.viewBoard = false;
		GTE.viewLevel = true;
	}

	GTE.resizeToFit();
};

GTE.selectLevel = function(i){
	GTE.setView("level");

	GTE.level = i;
	GTE.lastWon = true;
	GTE.dirtyBG = true;

	GTE.stage      = 0;
	GTE.stagesLost = 0;
	GTE.stagesWon  = 0;
	GTE.levelCompleted = false;

	GTE.startNewStage();
};

GTE.resizeToFit = function(){
	var w = $(window).width();
	var h = $(window).height();

	GTE.canvas.width  = w;
	GTE.canvas.height = h;

	if(GTE.viewBoard){
		GTE.setBoardRenderBox();
		GTE.dirtyBoardGameBackground = true;
	}else if(GTE.viewLevel){
		GTE.scaleModel();
		GTE.setLevelRenderBox();
		GTE.initAABBTree();
		GTE.pCanvases = [];
		GTE.dirtyBG = true;
	}

	GTE.dirtyCanvas = true;
};

GTE.getRenderBoxWidth  = function(){return GTE.renderBox[2] - GTE.renderBox[0];};
GTE.getRenderBoxHeight = function(){return GTE.renderBox[3] - GTE.renderBox[1];};

// **** SOUNDS **** //
GTE.loadSound = function(name){
	var getBounce = new XMLHttpRequest();

	getBounce.open("GET","snd/bounce.wav",true);
	getBounce.responseType = "arraybuffer";
	getBounce.onload = function(){
		GTE.ac.decodeAudioData(getBounce.response,
			function(buffer){
				GTE.sounds[name].data = buffer;
				GTE.sounds[name].loaded = true;
			})
	}
	getBounce.send();
};

GTE.loadSounds = function(){
	if(!GTE.soundsEnabled){return;}

	GTE.sounds = {
		bounce: {filename:"bounce.wav"}
	};

	GTE.ac = new AudioContext();

	var name;
	for(name in GTE.sounds){
		if(GTE.sounds.hasOwnProperty(name)){
			GTE.sounds[name].loaded = false;
			GTE.sounds[name].playing = [];
			GTE.sounds[name].numPlaying = 0;
			GTE.loadSound(name);
		}
	}
};

GTE.playBounceSound = function(pAID,pBID,gain){
	var maxID = Math.max(pAID,pBID);
	var minID = Math.min(pAID,pBID);

	var hash = minID*10000+maxID+1;
	var maxGain = 0.1;
	gain = gain < 0 ? 0 : gain > maxGain ? maxGain : gain;

	GTE.playSound("bounce",hash,gain);
};

GTE.playSound = function(name,hash,gain){
	if(true||!GTE.soundsEnabled){return;}

	var removeHashFunction = function(name,hash){
		return function(){
			GTE.sounds["bounce"].numPlaying--;
			var name0 = name;
			var hash0 = hash;
			var sound = GTE.sounds[name0];
			var index = sound.playing.indexOf(hash0);
			// console.log(sound.playing,hash,index);
			if(index >= 0){
				sound.playing[index] = 0;
			}
		};
	};

	if(typeof GTE.sounds[name] === 'object' && GTE.sounds[name].loaded){
		if(GTE.sounds[name].playing.indexOf(hash) == -1){
			var playSound = GTE.ac.createBufferSource();
			var gainNode  = GTE.ac.createGain();
			playSound.buffer = GTE.sounds[name].data;
			playSound.connect(gainNode);
			gainNode.gain.value = gain;

			gainNode.connect(GTE.ac.destination);
			playSound.start(0);

			playSound.onended = removeHashFunction(name,hash);
			
			var sound = GTE.sounds[name];
			var index = 0;
			while(index < sound.playing.length){
				if(sound.playing[index] == 0){
					break;
				}
				index++;
			}
			GTE.sounds[name].playing[index] = hash;
			GTE.sounds[name].numPlaying++;
		}
	}
};

// *** LocalStorage Check ***
function supports_html5_storage() {
	try{
		return 'localStorage' in window && window['localStorage'] !== null;
	}catch (e){
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