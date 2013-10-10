GTE.gameInternalToRenderSpace = function(x,y){
	var xRender = x / 2 * GTE.getRenderBoxWidth()  + GTE.renderBox[0];
	var yRender = GTE.renderBox[1] + y*GTE.getRenderBoxWidth()/2;
	return [xRender,yRender];
};

GTE.gameRenderToInternalSpace = function(x,y){
	var xInternal = 2*(x - GTE.renderBox[0]) / GTE.getRenderBoxWidth();
	var yInternal = (y - GTE.renderBox[1]) / GTE.getRenderBoxWidth()*2;
	return [xInternal,yInternal];
};

GTE.internalToRenderSpace = function(x,y){
	var xRender = x * GTE.getRenderBoxWidth()  + GTE.renderBox[0];
	var yRender = y * GTE.getRenderBoxHeight() + GTE.renderBox[1];
	return [xRender,yRender];
};

GTE.renderToInternalSpace = function(x,y){
	var xInternal = (x - GTE.renderBox[0]) / GTE.getRenderBoxWidth();
	var yInternal = (y - GTE.renderBox[1]) / GTE.getRenderBoxHeight();
	return [xInternal,yInternal];
};

GTE.gameToBoardInternalSpace = function(x,y){
	var newX = x/2;
	var newY = y/2*GTE.getRenderBoxWidth()/GTE.getRenderBoxHeight();

	return [newX,newY];
};

GTE.getYScale = function(x,y){
	var w = GTE.getRenderBoxWidth();
	var h = GTE.getRenderBoxHeight();
	var yScale = 2*h/w;

	return yScale;
};

GTE.randGaussian = function(avg,std){
	var z = Math.sqrt(-2*Math.log(Math.random()))*Math.cos(2*Math.PI*Math.random());
	return avg + std * z;
};

GTE.sanitizeLevelSettings = function(s){
	if(typeof s !== 'object'){s = {};}

	var defaultS = {
		'levelID' : 0,
		'rounds' : 10,
		'starReqs' : [7, 9, 10],

		'viscosity' : 0.02,
		'CoeffRestitution' : 0.6,
		'annihilate' : false,
		'combine' : true,
		'transfer' : false,
		'integerMass' : false,
		'massSigma' : 0.001,
		'massMax' : 100,
		'initMassMax' : 3,

		'numParticles' : 20,
		'numParticlesSTD' : 0.10,

		'signBias' : 0, //1 for all positive, -1 for all negative
		'v0' : 0,
		'r' : 0.05,
		'g' : 0
	};

	for(key in defaultS){
		if(s[key] == null){
			s[key] = defaultS[key];
		}
	}

	return s;
};

GTE.initModel = function(){
	GTE.levelSettings = GTE.sanitizeLevelSettings(GTE.gameLevels['level'+GTE.level]);

	var v0 = GTE.levelSettings.v0;
	var N  = GTE.levelSettings.numParticles;

	N += GTE.randGaussian(0,N*GTE.levelSettings.numParticlesSTD);
	if(N < 0){N = 0;}

	N = N+0.5|0;

	GTE.levelState = {
		levelID: GTE.level,
		particles: [],
		forces: [],
		mouseForces: []
	};

	// x: [0,2] (x <= 1 => particle on left side)
	// y: [0,1]

	//Tmp generate particles
	var maxItter = 10000;
	var itter = 0;

	var numLeft = GTE.randGaussian(N/2,0.05*N/2);
	numLeft = numLeft < 0 ? 0 : numLeft > N ? N : numLeft;
	numLeft = numLeft + 0.5 | 0;
	var numRight = N - numLeft;
	//TODO: potential problem when hits iter limit, since filling one side first

	for(var i = 0; i < N; i++){
		
		do{
			var sign = 1;
			if(Math.random()*2-1 >= GTE.levelSettings['signBias']){
				sign = -1;
			}

			var mass = GTE.levelSettings['initMassMax'] * sign* Math.random();
			if(GTE.levelSettings['integerMass']){
				mass = Math.round(mass);
			}

			var angle = Math.random() * Math.PI * 2;
			var vX = v0 * Math.cos(angle);
			var vY = v0 * Math.sin(angle);

			var side = i < numLeft ? 0 : 1;

			var particle = {
				id: i,
				x: side + Math.random(),
				y: Math.random(),
				vX: vX,
				vY: vY,
				m: mass,
				r: GTE.levelSettings['r'],
				resolved: false,
				toUpdateTree: true
			};
			itter++;
		}while(itter < maxItter && GTE.isCollision(particle) || Math.abs(particle.m) < GTE.levelSettings.massSigma);
		
		GTE.levelState.particles.push(particle);
	}

	GTE.levelState.temperatureLeft = 0;
	GTE.levelState.temperatureRight = 0;
	GTE.levelState.aspect = 2;
	GTE.scaleModel();

	GTE.initAABBTree();
};

GTE.cloneParticle = function(p){
	var particle = {
					id: p.id + Math.random()*100000|0,
					x:  p.x,
					y:  p.y,
					vX: p.vX,
					vY: p.vY,
					m:  p.m,
					r:  p.r,
					resolved: p.resolved
				};
	return particle;
}

GTE.getGTEGroup = function(){

	//sum = group 1 - group 2
	var sum = 0;
	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		if(p.x < 1){
			sum+=p.m;
		}else{
			sum-=p.m;
		}
	}

	if(sum == 0){return 0;}
	if(sum > 0){return 1;}
	return 2;
};

GTE.createMouseForce = function(forceID,pIndex,x,y){
	var p = GTE.levelState.particles[pIndex];
	if(typeof p !== 'object'){return;}

	//console.log(Math.sqrt((p.x-x)*(p.x-x)+(p.y-y)*(p.y-y)));
	var force = {
		pID: p.id,
		k: 150,
		b: 0.5,
		pX0: p.x,
		pY0: p.y,
		fX0: x,
		fY0: y,
		fDr: Math.sqrt((p.x-x)*(p.x-x)+(p.y-y)*(p.y-y)),
		fX: x,
		fY: y
	};

	GTE.levelState.mouseForces[forceID] = force;
};

GTE.updateMouseForce = function(forceID,x,y){
	var f = GTE.levelState.mouseForces[forceID];
	if(typeof f !== 'object'){return;}

	f.fX = x;
	f.fY = y;
};

GTE.destroyMouseForce = function(forceID,x,y){
	GTE.levelState.mouseForces[forceID] = undefined;
};

GTE.updateParticlePos = function(p,x,y){
	if(p.x != x || p.y != y){
		p.x = x;
		p.y = y;

		GTE.dirtyCanvas = true;
	}
};

//Assumes barrier in center
GTE.isCollision = function(p){

	//Box sides
	if(p.x-p.r<0 || p.x+p.r>2 || p.y-p.r<0 || p.y+p.r>1){return true;}

	//Box midSection
	if(p.x < 1 && p.x+p.r >= 1 || p.x > 1 && p.x-p.r <= 1){return true;}

	//Particle collisions (expensive if many particles)
	//TODO: use kd tree
	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var pN = GTE.levelState.particles[i];
		if(p.id == pN.id){continue;}

		if((p.x-pN.x)*(p.x-pN.x) + (p.y-pN.y)*(p.y-pN.y) < (p.r+pN.r)*(p.r+pN.r)){return true;}
	}

	return false;
}

GTE.setParticlesUnresolved = function(){
	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		p.resolved = false;
	}
};

GTE.scaleModel = function(){
	var w = GTE.getRenderBoxWidth();
	var h = GTE.getRenderBoxHeight();
	// console.log(w,h,GTE.levelState.aspect);
	var yScale = GTE.levelState.aspect * (h/w);
	GTE.levelState.aspect = w/h;

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];

		// p.r  *= (w+h)/2 / w;
		p.y  *= yScale;
		p.vY *= yScale;
	}
};

GTE.getMedian = function(array,total){
	var sum = 0;
	var last = 0;
	for(var i = 0; i < array.length; i++){
		sum += array[i];		

		if(sum >= total/2){
			break;
		}
	}

	return i/(array.length-1);
};
	
GTE.buildAABBTree = function(node,maxDepth,minParticles){

	// function getMinBox(particles,box){
	// 	if(typeof particles !== 'object' || particles.length == 0){return box;}

	// 	var p = particles[0];
	// 	var minX = p.x-p.r;
	// 	var maxX = p.x+p.r;
	// 	var minY = p.y-p.r;
	// 	var maxY = p.y+p.r;

	// 	for(var i = 1; i < particles.length; i++){
	// 		p = particles[i];
	// 		if(p.x-p.r < minX){
	// 			minX = p.x-p.r;
	// 		}
	// 		if(p.x+p.r > maxX){
	// 			maxX = p.x+p.r;
	// 		}
	// 		if(p.y-p.r < minY){
	// 			minY = p.y-p.r;
	// 		}
	// 		if(p.y+p.r > maxY){
	// 			maxY = p.y+p.r;
	// 		}
	// 	}

	// 	if(minX < box[0]){minX = box[0];}
	// 	if(minY < box[1]){minY = box[1];}
	// 	if(maxX > box[2]){maxX = box[2];}
	// 	if(maxY > box[3]){maxY = box[3];}
	// 	// if(particles.length == 1){
	// 		return [minX,minY,maxX,maxY];
	// 	// }
	// };

	// function getDistro(particles,box){
	// 	var n = 32;
	// 	var distroX  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//new Uint8Array(n);
	// 	var distroY  = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];//new Uint8Array(n);
	// 	var density = new Uint8Array(n);
	// 	var dx = (box[2]-box[0])/(n-1);
	// 	var dy = (box[3]-box[1])/(n-1);

	// 	for(var i = 0; i < particles.length; i++){
	// 		var p = particles[i];

	// 		var xI = (p.x-box[0])/dx+0.5|0;
	// 		var yI = (p.y-box[1])/dy+0.5|0;

	// 		xI = xI < 0 ? 0 : xI >= 32 ? 32 : xI;
	// 		yI = yI < 0 ? 0 : yI >= 32 ? 32 : yI;
	// 		// if(axis == 0){
	// 			// var x = p.x-p.r;
	// 			// for(var j = 0; j < 2*p.r; j+=dx){
	// 			// 	if(x+j < box[0]){continue;}
	// 			// 	if(x+j > box[2]){break;}
	// 				// if(((p.x-box[0])/dx|0) >= n){console.log((p.x-box[0])/dx|0)}
	// 				// if((p.x-box[0])/dx+0.5|0 < 0){console.log('woops')}
	// 				distroX[xI]++;
	// 				distroY[yI]++;
	// 				// distro[(x+j-box[0])/dx+0.5|0]++;
	// 			// }
	// 		// }else{
	// 			// var y = p.x-p.r;
	// 			// for(var j = 0; j < 2*p.r; j+=dx){
	// 			// 	if(x+j < box[1]){continue;}
	// 			// 	if(x+j > box[3]){break;}

	// 				// distro[(x+j-box[1])/dx+0.5|0]++;
	// 			// }
	// 		// }
	// 	}
	// 	// if(Math.random() < 0.01){console.log(distroX,distroY);}
	// 	return [distroX,distroY];
	// };

	// // console.log(getDistro(GTE.levelState.particles,[0,0,2,1],0));

	// function buildHelper(node,maxDepth,minParticles){
	var numParticles = node.particles.length;

	var box = node.box;
	var makeChildren = false;

	if(numParticles > minParticles && node.depth < maxDepth){
		makeChildren = true;
	}  

	if(makeChildren){
		node.isLeaf = false;
        var iAxis = box[3]-box[1] > box[2]-box[0] ? 1 : 0;

		//Get the Arrays for min, max dimensions
		var min = box[0];
		var max = box[2];

		//get center of the box for longest axis
		// var distros = getDistro(node.particles,box,iAxis);
		var medianF = 0.5;//GTE.getMedian(distros[iAxis],numParticles);


		var center = medianF*(box[2]-box[0])+box[0];
		if(iAxis == 1){
			center = medianF*(box[3]-box[1])+box[1];
		}

		var particlesLeft  = [];
		var particlesRight = [];

		var nodeLeft = {
			box : [box[0],box[1],center,box[3]],
			depth : node.depth+1,
			particles : []
		};
		var nodeRight = {
			box : [center,box[1],box[2],box[3]],
			depth : node.depth+1,
			particles : []
		};

		if(iAxis == 1){
			nodeLeft.box  = [box[0],box[1],box[2],center];
			nodeRight.box = [box[0],center,box[2],box[3]];
		}

		var minXL = nodeLeft.box[2];
		var maxXL = nodeLeft.box[0];
		var minYL = nodeLeft.box[3];
		var maxYL = nodeLeft.box[1];
		var minXR = nodeRight.box[2];
		var maxXR = nodeRight.box[0];
		var minYR = nodeRight.box[3];
		var maxYR = nodeRight.box[1];

		for(var i = 0; i < numParticles; i++){
			var p = node.particles[i];
			if(iAxis == 0){
				if(p.x - p.r <= center){
					nodeLeft.particles.push(p);
					if(p.x-p.r < minXL){minXL = p.x-p.r;}
					if(p.x+p.r > maxXL){maxXL = p.x+p.r;}
					if(p.y-p.r < minYL){minYL = p.y-p.r;}
					if(p.y+p.r > maxYL){maxYL = p.y+p.r;}
				}

				if(p.x + p.r >= center){
					nodeRight.particles.push(p);
					if(p.x-p.r < minXR){minXR = p.x-p.r;}
					if(p.x+p.r > maxXR){maxXR = p.x+p.r;}
					if(p.y-p.r < minYR){minYR = p.y-p.r;}
					if(p.y+p.r > maxYR){maxYR = p.y+p.r;}
				}
			}else{
				if(p.y - p.r <= center){
					nodeLeft.particles.push(p);
					if(p.x-p.r < minXL){minXL = p.x-p.r;}
					if(p.x+p.r > maxXL){maxXL = p.x+p.r;}
					if(p.y-p.r < minYL){minYL = p.y-p.r;}
					if(p.y+p.r > maxYL){maxYL = p.y+p.r;}
				}

				if(p.y + p.r >= center){
					nodeRight.particles.push(p);
					if(p.x-p.r < minXR){minXR = p.x-p.r;}
					if(p.x+p.r > maxXR){maxXR = p.x+p.r;}
					if(p.y-p.r < minYR){minYR = p.y-p.r;}
					if(p.y+p.r > maxYR){maxYR = p.y+p.r;}
				}
			}
		}

		// if(minXL < nodeLeft.box[0]){minXL = nodeLeft.box[0];}
		// if(minYL < nodeLeft.box[1]){minYL = nodeLeft.box[1];}
		// if(maxXL > nodeLeft.box[2]){maxXL = nodeLeft.box[2];}
		// if(maxYL > nodeLeft.box[3]){maxYL = nodeLeft.box[3];}
		// if(minXR < nodeRight.box[0]){minXR = nodeRight.box[0];}
		// if(minYR < nodeRight.box[1]){minYR = nodeRight.box[1];}
		// if(maxXR > nodeRight.box[2]){maxXR = nodeRight.box[2];}
		// if(maxYR > nodeRight.box[3]){maxYR = nodeRight.box[3];}

		nodeLeft.box  = [minXL,minYL,maxXL,maxYL];
		nodeRight.box = [minXR,minYR,maxXR,maxYR];
		
		node.nodeLeft = nodeLeft;
		node.nodeRight = nodeRight;
		GTE.buildAABBTree(nodeLeft,maxDepth,minParticles);
		GTE.buildAABBTree(nodeRight,maxDepth,minParticles);

		node.particles = [];
	}else{
		node.isLeaf = true;
	}
};

GTE.initAABBTree = function(){

	var maxDepth = 7;
	var minParticles = 7;

	var yScale = GTE.getYScale();
	var rootNode = 
	{
		'box'       : [0,0*yScale,2,1*yScale],
		'particles' : GTE.levelState.particles,
		'depth'     : 0
	};

	GTE.AABBTree = {
		'root' : rootNode,
		'maxDepth' : maxDepth,
		'minParticles' : minParticles
	};

	GTE.buildAABBTree(rootNode,maxDepth,minParticles);
};

GTE.updateAABBTreeParticle = function(node,p){

	if(node.isLeaf){
		if(node.particles.indexOf(p) == -1){
			node.particles.push(p);

			if(p.x-p.r < box[0]){box[0] = p.x-p.r;}
			if(p.x+p.r > box[1]){box[1] = p.x+p.r;}
			if(p.y-p.r < box[2]){box[2] = p.y-p.r;}
			if(p.y+p.r > box[3]){box[3] = p.y+p.r;}
		}
	}else{
		if(typeof node.nodeLeft === 'object'){
			box = node.nodeLeft.box;
			if(p.x+p.r >= box[0] && p.x-p.r <= box[2] && p.y+p.r >= box[1] && p.y-p.r <= box[3]){
				GTE.updateAABBTreeParticle(node.nodeLeft,p);
			}
		}

		if(typeof node.nodeRight === 'object'){
			box = node.nodeRight.box;
			if(p.x+p.r >= box[0] && p.x-p.r <= box[2] && p.y+p.r >= box[1] && p.y-p.r <= box[3]){
				GTE.updateAABBTreeParticle(node.nodeRight,p);
			}
		}
	}

};

GTE.updateMoveParticle = function(node,p){
	var root = GTE.AABBTree;
	var box = node.box;

	if(p.x-p.r >= box[0] && p.x+p.r <= box[2] && p.y-p.r >= box[1] && p.y+p.r <= box[3]){
		
		// Strictly inside box
		// We're good to go
		return;
	}else if(p.x+p.r >= box[0] && p.x-p.r <= box[2] && p.y+p.r >= box[1] && p.y-p.r <= box[3]){

		//Partly inside box
		//Might have entered other boxes :/
		p.toUpdateTree = true;
	}else{

		//Now outside box
		//Remove from particles
		node.particles.splice(node.particles.indexOf(p),1);
			
		p.toUpdateTree = true;
	}
};

GTE.updateAABBTree = function(){
	var root = GTE.AABBTree.root;
	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		if(p.toUpdateTree){
			GTE.updateAABBTreeParticle(root,p);
			p.toUpdateTree = false;
		}
	}
};

GTE.updateModel = function(deltaTime){

	while(deltaTime > 0){
		var w = GTE.getRenderBoxWidth();
		var h = GTE.getRenderBoxHeight();

		var yLimit = 2*h/w;

		var dT = Math.min(5,deltaTime) / 500;
		deltaTime -= 5;

		//Set all particles unresolved
		GTE.setParticlesUnresolved();

		var tempLeft  = 0;
		var tempRight = 0;

		//Update forces
		for(var i = 0; i < GTE.levelState.mouseForces.length; i++){
			var f = GTE.levelState.mouseForces[i];
			if(typeof f === "undefined"){continue;}

			var found = false;
			var p;
			for(var j = 0; j < GTE.levelState.particles.length; j++){
				p = GTE.levelState.particles[j];
				if(p.id == f.pID){found = true; break;}
			}
			if(!found){continue;}

			var dr = Math.sqrt((p.x-f.fX)*(p.x-f.fX) + (p.y-f.fY)*(p.y-f.fY)); 
			var cX = (f.fX-p.x) / dr;
			var cY = (f.fY-p.y) / dr;

			// if(dr < p.r && p.r > 0){
			// 	dr *= dr/p.r;
			// }

			var tX =  cY;
			var tY = -cX;
			var force = f.k*dr;

			var absM = Math.abs(p.m);

			var vF = p.vX*cX+p.vY*cY;
			var forceDamp  = -Math.sqrt(4 * f.k * absM) * vF;

			var vFT = p.vX*tX+p.vY*tY;
			var forceDampT = -Math.sqrt(4 * f.k * absM) * vFT;

			if(dr > 0){
				p.vX += dT * (force+forceDamp) * cX / absM;
				p.vY += dT * (force+forceDamp) * cY / absM;

				p.vX += dT * forceDampT * tX / absM;
				p.vY += dT * forceDampT * tY / absM;
			}
		}

		for(var i = 0; i < GTE.levelState.particles.length; i++){
			var p = GTE.levelState.particles[i];

			//Gravity force
			p.vY += dT * GTE.levelSettings.g;
	
			//Viscosity force
			p.vX -= dT * GTE.levelSettings.viscosity * p.vX;
			p.vY -= dT * GTE.levelSettings.viscosity * p.vY;

		}

		//Update positions
		function helperStep(node){
			if(typeof node !== 'object' || typeof node.particles !== 'object'){return;}

			var leaf = true;

			//Recurisve
			if(typeof node.nodeLeft === 'object'){
				helperStep(node.nodeLeft);
				leaf = false;
			}

			if(typeof node.nodeRight === 'object'){
				helperStep(node.nodeRight);
				leaf = false;	
			}

			if(!leaf){return;}
			var unresolved = true;
			while(unresolved){
				unresolved = false;
				for(var i = 0; i < node.particles.length; i++){
					var p = node.particles[i];
					if(p.resolved){continue;}

					//Collision check
					var pXNew = p.x + dT*p.vX;
					var pYNew = p.y + dT*p.vY;

					var pA  = p;
					var vxA = pA.vX;
					var vyA = pA.vY;

					var xA  = pA.x + dT*vxA;
					var yA  = pA.y + dT*vyA;

					var mA  = pA.m;
					var rA  = pA.r;

					var toRemove = false;

					// var node = GTE.AABBTree;
					// var foundBox = false;
					// while(!foundBox){

						// if(typeof node.nodeLeft === 'object'){
						// 	//if(pA.x >= node.nodeLeft.box[0] && pA.x <= node.nodeLeft.box[2] && pA.y >= node.nodeLeft.box[1] && pA.y <= node.nodeLeft.box[3]){
						// 		node = node.nodeLeft;
						// 	//}else{
						// 	//	node = node.nodeRight;
						// 	//}
						// }else{
							// foundBox = true;
						// }

						for(var j = 0; j < node.particles.length; j++){
							var pB = node.particles[j];
							if(pB.x == pA.x && pB.y == pA.y){continue;} //same particle check

							if(pA.x < 1 && pB.x > 1 || pA.x > 1 && pB.x < 1){continue;}
							var vxB = pB.vX;
							var vyB = pB.vY;
							var mB  = pB.m;
							var rB  = pB.r;

							var xB = pB.x + dT*vxB;
							var yB = pB.y + dT*vyB;

							var dist = Math.sqrt(Math.pow(xB-xA,2) + Math.pow(yB-yA,2));
							var distNow = Math.sqrt(Math.pow(pB.x-pA.x,2)+Math.pow(pB.y-pA.y,2));

							if(dist < rA + rB){
								if((GTE.levelSettings.annihilate && pA.m*pB.m < 0) || (Math.abs(pB.m) < GTE.levelSettings.massMax && GTE.levelSettings.combine && pA.m*pB.m > 0)){

									var massTransfer = pA.m;
									if(Math.abs(pA.m+pB.m) > GTE.levelSettings.massMax){
										massTransfer = Math.abs(pA.m+pB.m) - GTE.levelSettings.massMax;

										if(pB.m > 0){
											massTransfer = pA.m - massTransfer;
										}else{
											massTransfer = pA.m + massTransfer;	
										}
									}else{
										toRemove = true;
									}

									if(Math.abs(pB.m + massTransfer) < GTE.levelSettings.massSigma){
										GTE.levelState.particles.splice(j,1);
									}else{
										var absA = Math.abs(massTransfer);
										var absB = Math.abs(pB.m);
										var absMass = absA+absB;
										pB.vX = (pB.vX*absB+pA.vX*absA)/absMass;
										pB.vY = (pB.vY*absB+pA.vY*absA)/absMass;

										pB.x = (pB.x*absB+pA.x*absA)/absMass;
										pB.y = (pB.y*absB+pA.y*absA)/absMass;

										pB.m += massTransfer;
										pA.m -= massTransfer;

										if(toRemove){
											for(var k = 0; k < GTE.levelState.mouseForces.length; k++){
												var f = GTE.levelState.mouseForces[k];
												if(typeof f === 'object' && f.pID == pA.id){
													f.pID = pB.id;
												}
											}
										}
									}

									break;
								}else{
									mA = Math.abs(mA);
									mB = Math.abs(mB);
								}
							}

							if(distNow < rA + rB){
								var xNorm = (xB-xA) / dist;
								var yNorm = (yB-yA) / dist;

								//Penalty forces
								var k = 0.03;
								var force = -(dist - (rA + rB)) / (dist + 0.0001) * mB * mA;
								pA.vX -= k * force * xNorm / mA;
								pA.vY -= k * force * yNorm / mA;
								pB.vX += k * force * xNorm / mB;
								pB.vY += k * force * yNorm / mB;
							}else if(dist < rA + rB){

								//Collision detected
								var Cr = GTE.levelSettings.CoeffRestitution;

								// Proper collision reolution
								var xNorm = (xB-xA) / dist;
								var yNorm = (yB-yA) / dist;

								var xTan =  yNorm;
								var yTan = -xNorm;

								var vA = vxA * xNorm + vyA * yNorm;
								var vB = vxB * xNorm + vyB * yNorm;

								var vAT = vxA * xTan + vyA * yTan;
								var vBT = vxB * xTan + vyB * yTan;

								var vANew = (Cr * mB * (vB - vA) + mB * vB + mA * vA) / (mA + mB);
								var vBNew = (Cr * mA * (vA - vB) + mB * vB + mA * vA) / (mA + mB);

								pA.vX = vANew * xNorm + vAT * xTan;
								pA.vY = vANew * yNorm + vAT * yTan;
								pB.vX = vBNew * xNorm + vBT * xTan;
								pB.vY = vBNew * yNorm + vBT * yTan;
							}
						}
					// }

					if(toRemove){
						GTE.levelState.particles.splice(i,1);
						GTE.dirtyCanvas = true;
						break;
					}

					//Left box collision
					if(pXNew - p.r < 0){
						pXNew = p.r - pXNew + p.r;
						p.vX = -p.vX*GTE.levelSettings.CoeffRestitution;
					}

					//Right box collision
					if(pXNew + p.r > 2){
						pXNew = 2-(p.r + pXNew - 2) - p.r;
						p.vX = -p.vX*GTE.levelSettings.CoeffRestitution;
					}

					//Top box collision
					if(pYNew - p.r < 0){
						pYNew = p.r - pYNew + p.r;
						p.vY = -p.vY*GTE.levelSettings.CoeffRestitution;
					}

					//Bottom box collision
					if(pYNew + p.r > yLimit){
						pYNew = yLimit-(p.r + pYNew-yLimit) - p.r;
						p.vY = -p.vY*GTE.levelSettings.CoeffRestitution;
					}

					if(GTE.levelSettings.transfer){
						if(p.x < 1 && pXNew > 1){
							p.m *= -1;
						}else if(p.x > 1 && pXNew < 1){
							p.m *= -1;
						}
					}else{

						//Left to Right collision
						if(p.x < 1 && pXNew+p.r > 1){
							p.vX = -p.vX*GTE.levelSettings.CoeffRestitution;

							// newP.m = -p.m;
							pXNew = 1-(p.r + pXNew - 1) - p.r;
							// newP.vX = -p.vX;
						} else 
						
						//Right to Left collision
						if(p.x > 1 && pXNew-p.r < 1){
							p.vX = -p.vX*GTE.levelSettings.CoeffRestitution;
							// newP.m = -p.m;
							pXNew = 1+(p.r - pXNew + 1) + p.r;
						}
					}

					if(pXNew < 1){
						tempLeft  += p.m * Math.sqrt(Math.pow(p.vX,2)+Math.pow(p.vY,2));
					}else{
						tempRight += p.m * Math.sqrt(Math.pow(p.vX,2)+Math.pow(p.vY,2));
					}

					GTE.updateParticlePos(p, pXNew, pYNew);
					GTE.updateMoveParticle(node,p);
					p.resolved = true;
				}
			}
		}

		helperStep(GTE.AABBTree.root);
		GTE.updateAABBTree();
	}

	// console.log(GTE.levelState.temperature)
	GTE.levelState.temperatureLeft  = GTE.levelState.temperatureLeft*0.9  + tempLeft*0.1;
	GTE.levelState.temperatureRight = GTE.levelState.temperatureRight*0.9 + tempRight*0.1;
};