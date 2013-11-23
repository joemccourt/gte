"use strict";

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

GTE.sign = function(x){return x < 0 ? -1 : x > 0 ? 1 : 0;};

GTE.getPrimeFactors = function(number){
	var factors = {};
	var d = 2;
	while(d <= number){
		if(!(number%d)){
			if(!factors[d]){
				factors[d] = 1;
			}else{
				factors[d]++; 
			}
			number/=d;
		}else{
			d++;
		}
	}
	return factors;
};

GTE.sanitizeLevelSettings = function(level){
	if(typeof level !== 'object'){level = {};}

	var defaultLevel = GTE.gameLevels['default'];
	for(var key in defaultLevel){
		if(defaultLevel.hasOwnProperty(key) && level[key] == null){
			level[key] = defaultLevel[key];
		}
	}

	return level;
};

GTE.initModel = function(){
	GTE.levelSettings = GTE.sanitizeLevelSettings(GTE.gameLevels['level'+GTE.level]);

	var v0 = GTE.levelSettings.v0;
	var N  = GTE.levelSettings.numParticles;

	N += GTE.randGaussian(0,N*GTE.levelSettings.numParticlesSTD);
	if(N <= 0){N = 1;}

	N = N+0.5|0;

	GTE.levelState = {
		levelID: GTE.level,
		particles: [],
		forces: [],
		mouseForces: [],
		staticSpringForces: []
	};

	// x: [0,2] (x <= 1 implies particle on left side)
	// y: [0,1]

	//Tmp generate particles
	var maxItter = 100;

	var numLeft = GTE.randGaussian(N/2,GTE.levelSettings['numParticlesDiffSTD']*N/2);
	numLeft = numLeft < 0 ? 0 : numLeft > N ? N : numLeft;
	numLeft = numLeft + 0.5 | 0;
	var numRight = N - numLeft;

	var massDiff = 0; //Left - right

	//TODO: potential problem when hits iter limit, since filling one side first
	for(var i = 0; i < N; i++){
		var itter = 0;

		do{
			var mass = GTE.levelSettings['initMassMax'] * Math.random();
			if(GTE.levelSettings['integerMass']){
				mass = Math.ceil(mass);
			}

			if(GTE.levelSettings['initMassMin'] > mass){
				mass = GTE.levelSettings['initMassMin'];
			}

			var sign = 1;
			if(Math.random()*2-1 >= GTE.levelSettings['signBias']){
				sign = -1;
			}
			mass *= sign;

			var angle = Math.random() * Math.PI * 2;
			var vX = v0 * Math.cos(angle);
			var vY = v0 * Math.sin(angle);

			var side = i < numLeft ? 0 : 1;

			//If last particle creates equality flip side
			if(i == N - 1 && massDiff+(side == 0 ? 1 : -1)*mass == 0){
				side = side == 0 ? 1 : 0;
				console.log("new side: ",side);
			}

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

		}while(!GTE.isValidNewParticle(particle) && itter < maxItter);

		if(itter < maxItter){
			massDiff += (particle.x < 1 ? 1 : -1) * particle.m;
			GTE.levelState.particles.push(particle);
		}		
	}

	GTE.levelState.temperatureLeft = 0;
	GTE.levelState.temperatureRight = 0;
	GTE.levelState.aspect = 2;
	GTE.scaleModel();

	GTE.initAABBTree();
};

GTE.isValidNewParticle = function(p){
	if(GTE.isCollision(p)){return false;}
 	if(Math.abs(p.m) < GTE.levelSettings.massSigma){return false;}
 	return true;
};

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
		p: p,
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
	if(typeof f !== 'object' || f == null){return;}

	f.fX = x;
	f.fY = y;
};

GTE.destroyMouseForce = function(forceID,x,y){
	GTE.levelState.mouseForces[forceID] = undefined;
};

GTE.hasMouseForce = function(forceID){
	var f = GTE.levelState.mouseForces[forceID];
	if(typeof f !== 'object' || f == null){return false;}
	return true;
}

//Assumes barrier in center
GTE.isCollision = function(p){

	//Box sides
	if(p.x-p.r<0 || p.x+p.r>2 || p.y-p.r<0 || p.y+p.r>1){return true;}

	//Box midSection
	if(p.x < 1 && p.x+p.r >= 1 || p.x > 1 && p.x-p.r <= 1){return true;}

	//Particle collisions (expensive if many particles)
	//TODO: use AABB tree.  See if this is a bottleneck for anything first
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
	if(!GTE.levelState || !GTE.levelState.particles){return;}

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
	
GTE.buildAABBTree = function(root,node){
	if(typeof node.particles !== 'object'){return;}
	var numParticles = node.particles.length;

	var box = node.box;
	var makeChildren;

	if(numParticles > root.minParticles && node.depth < root.maxDepth){
		makeChildren = true;
	}else{
		makeChildren = false;

		node.isLeaf = true;
		root.leaves.push(node);
	}

	if(makeChildren){
		node.isLeaf = false;
        var iAxis = box[3]-box[1] > box[2]-box[0] ? 1 : 0;

		var nodeLeft = {
			particles : []
		};

		var nodeRight = {
			particles : []
		};

		nodeLeft.depth = node.depth+1;
		nodeRight.depth = node.depth+1;

		var medianF = 0.5;

		var center;
		if(iAxis == 1){
			center = medianF*(box[3]-box[1])+box[1];
		}else{
			center = medianF*(box[2]-box[0])+box[0];
		}		

		if(iAxis == 1){
			nodeLeft.box  = [box[0],box[1],box[2],center];
			nodeRight.box = [box[0],center,box[2],box[3]];
		}else{
			nodeLeft.box = [box[0],box[1],center,box[3]];
			nodeRight.box = [center,box[1],box[2],box[3]];
		}

		var numLeft = 0;
		var numRight = 0;
		if(iAxis == 0){
			for(var i = 0; i < numParticles; i++){
				var p = node.particles[i];
					if(p.x - p.r <= center){
						nodeLeft.particles[numLeft] = p;
						numLeft++;
					}

					if(p.x + p.r >= center){
						nodeRight.particles[numRight] = p;
						numRight++;
					}
				}
		}else{
			for(var i = 0; i < numParticles; i++){
				var p = node.particles[i];
				if(p.y - p.r <= center){
					nodeLeft.particles[numLeft] = p;
					numLeft++;
				}

				if(p.y + p.r >= center){
					nodeRight.particles[numRight] = p;
					numRight++;
				}
			}
		}
		
		node.nodeLeft = nodeLeft;
		node.nodeRight = nodeRight;
		GTE.buildAABBTree(root,nodeLeft);
		GTE.buildAABBTree(root,nodeRight);

		node.particles = [];
	}
};

GTE.initAABBTree = function(){

	var maxDepth = 11;
	var minParticles = 7;

	var yScale = GTE.getYScale();
	var rootNode = 
	{
		'box'       : [0,0*yScale,2,1*yScale],
		'particles' : GTE.levelState.particles,
		'depth'     : 0,
		'isLeft'    : false
	};

	GTE.AABBTree = {
		'root' : rootNode,
		'maxDepth' : maxDepth,
		'minParticles' : minParticles,
		'leaves' : [],
		'trim' : 0
	};

	GTE.buildAABBTree(GTE.AABBTree,rootNode);
};

GTE.updateAABBTreeParticle = function(root,node,p){
	if(typeof node !== 'object'){return;}
	var box;

	if(node.isLeaf){
		if(node.particles.indexOf(p) == -1){
			node.particles.push(p);
		}
	}else{
		if(typeof node.nodeLeft === 'object'){
			box = node.nodeLeft.box;

			if(p.x+p.r >= box[0] && p.x-p.r <= box[2] && p.y+p.r >= box[1] && p.y-p.r <= box[3]){
				GTE.updateAABBTreeParticle(root,node.nodeLeft,p);
			}
		}

		if(typeof node.nodeRight === 'object'){
			box = node.nodeRight.box;
			if(p.x+p.r >= box[0] && p.x-p.r <= box[2] && p.y+p.r >= box[1] && p.y-p.r <= box[3]){
				GTE.updateAABBTreeParticle(root,node.nodeRight,p);
			}
		}
	}
};

GTE.updateMoveParticle = function(node,p){
	if(typeof node !== 'object'){return;}
	var box = node.box;

	if(node.isLeaf){
		if(p.x-p.r > box[0] && p.x+p.r < box[2] && p.y-p.r > box[1] && p.y+p.r < box[3]){
			
			// Strictly inside box
			// We're good to go
			// p.toUpdateTree = true;

		}else if(p.x+p.r >= box[0] && p.x-p.r <= box[2] && p.y+p.r >= box[1] && p.y-p.r <= box[3]){

			//Partly inside box
			//Might have entered other boxes :/
			p.toUpdateTree = true;
		}else{

			//Now outside box
			//Remove from particles
			var index = node.particles.indexOf(p);
			if(index >= 0){
				node.particles.splice(index,1);
			}

			p.toUpdateTree = true;

		}
	}
};

GTE.trimAABBTree = function(root,node){
	if(typeof node !== 'object'){
		return 0;
	}

	if(node.isLeaf){
		var box = node.box;
		var i = 0;

		var numParticles = node.particles.length;

		if(numParticles > root.minParticles && node.depth < root.maxDepth){
			var nIndex = root.leaves.indexOf(node);
			if(nIndex != -1){root.leaves.splice(nIndex,1);}

			GTE.buildAABBTree(root,node);
		}

		return numParticles;
	}

	var sumL = GTE.trimAABBTree(root,node.nodeLeft);
	var sumR = GTE.trimAABBTree(root,node.nodeRight);

	if(sumL + sumR < root.minParticles){

		node.isLeaf = true;
		node.particles = node.nodeLeft.particles.concat(node.nodeRight.particles);

		var rLIndex = root.leaves.indexOf(node.nodeLeft);
		if(rLIndex != -1){root.leaves.splice(rLIndex,1);}else{console.log('fjkljsef')}
		
		var rRIndex = root.leaves.indexOf(node.nodeRight);
		if(rRIndex != -1){root.leaves.splice(rRIndex,1);}

		node.nodeLeft = undefined;
		node.nodeRight = undefined;

		root.leaves.push(node);
	}

	return sumL+sumR;
};

GTE.removeSetParticles = function(node){
	for(var leafI = 0; leafI < GTE.AABBTree.leaves.length; leafI++){
		var node = GTE.AABBTree.leaves[leafI];
		if(typeof node !== 'object' || typeof node.particles !== 'object'){return;}

		for(var i = 0; i < node.particles.length; i++){
			var p = node.particles[i];
			if(p.toRemove){
				var index = node.particles.indexOf(p);
				if(index >= 0){
					node.particles.splice(index,1);
					i--;
				}
			}
		}
	}
};

GTE.updateAABBTree = function(){
	var root = GTE.AABBTree.root;
	root.particles = GTE.levelState.particles;

	GTE.removeSetParticles(root);

	for(var i = 0; i < GTE.levelState.particles.length; i++){
		var p = GTE.levelState.particles[i];
		
		if(p.toRemove){
			var index = GTE.levelState.particles.indexOf(p);
			if(index >= 0){
				GTE.levelState.particles.splice(index,1);
				i--;
			}
		}

		if(p.toUpdateTree){
			GTE.updateAABBTreeParticle(GTE.AABBTree,root,p);
			p.toUpdateTree = false;
		}
	}

	if(GTE.AABBTree.trim > 0){
		GTE.trimAABBTree(GTE.AABBTree,root);
		GTE.AABBTree.trim = 0;
	}else{
		GTE.AABBTree.trim++;
	}
};

GTE.updateModel = function(deltaTime){
	var leftWall  = GTE.leftWall;
	var rightWall = GTE.rightWall;

	var transfer   = GTE.levelSettings.transfer;
	var combine    = GTE.levelSettings.combine;
	var annihilate = GTE.levelSettings.annihilate;

	if(GTE.animatingEndStage || GTE.levelCompleted){
		transfer = true;
		combine = false;
		annihilate = false;
	}	

	while(deltaTime > 0){
		var w = GTE.getRenderBoxWidth();
		var h = GTE.getRenderBoxHeight();

		var yLimit = 2*h/w;

		var dT = Math.min(20,deltaTime);
		deltaTime -= dT;

		dT /= 500;

		//Set all particles unresolved
		GTE.setParticlesUnresolved();

		var tempLeft  = 0;
		var tempRight = 0;

		//Update forces
		for(var i = 0; i < GTE.levelState.mouseForces.length; i++){
			var f = GTE.levelState.mouseForces[i];
			if(typeof f === "undefined" || f === null){continue;}

			var p = f.p;
			if(!p){continue;}

			var dr = Math.sqrt((p.x-f.fX)*(p.x-f.fX) + (p.y-f.fY)*(p.y-f.fY)); 
			var cX = (f.fX-p.x) / dr;
			var cY = (f.fY-p.y) / dr;

			var tX =  cY;
			var tY = -cX;
			var force = f.k*dr;

			var absM = Math.abs(p.m);
			if(absM < 1){absM = 1;}

			var vF = p.vX*cX+p.vY*cY;
			var forceDamp  = -Math.sqrt(4 * f.k * absM) * vF;

			var vFT = p.vX*tX+p.vY*tY;
			var forceDampT = -Math.sqrt(4 * f.k * absM) * vFT;

			if(dr > 0){
				var vXAdd = dT * ((force+forceDamp) * cX + forceDampT * tX)/ absM;
				var vYAdd = dT * ((force+forceDamp) * cY + forceDampT * tY)/ absM;
				
				var pXNew = p.x+(p.vX+vXAdd)*dT;
				var pYNew = p.y+(p.vY+vYAdd)*dT;

				if(pXNew - p.r < 0){
					vXAdd = -(p.x-p.r)/dT;
				}

				if(pXNew + p.r > 2){
					vXAdd = (2-p.x-p.r)/dT;
				}

				if(pYNew - p.r < 0){
					vYAdd = -(p.y-p.r)/dT;
				}

				if(pYNew + p.r > yLimit){
					vYAdd = (yLimit-p.y-p.r)/dT;
				}

				if(!transfer){
					if(p.x < leftWall && pXNew+p.r > leftWall){
						vXAdd = (leftWall-p.x-p.r)/dT;
					}

					if(p.x > rightWall && pXNew-p.r < rightWall){
						vXAdd = -(p.x-p.r-rightWall)/dT;
					}
				}

				p.vX += vXAdd;
				p.vY += vYAdd;
			}
		}

		for(var i = 0; i < GTE.levelState.staticSpringForces.length; i++){
			var f = GTE.levelState.staticSpringForces[i];
			if(typeof f === "undefined"){continue;}

			var p = f.p;
			var x = f.x;
			var y = f.y;

			var dr = Math.sqrt((p.x-x)*(p.x-x) + (p.y-y)*(p.y-y)); 
			var cX = (x-p.x) / dr;
			var cY = (y-p.y) / dr;

			var tX =  cY;
			var tY = -cX;
			var force = f.k*(dr-f.r0);

			var absM = Math.abs(p.m);

			var vF = (0-p.vX)*cX+(0-p.vY)*cY;
			var forceDamp  = Math.sqrt(4 * f.k * absM) * vF;

			var vFT = p.vX*tX+p.vY*tY;
			var forceDampT = 0;

			forceDampT -= Math.sqrt(4 * f.k * absM) * vFT;

			if(dr > 0){
				p.vX += dT * (force+forceDamp) * cX / absM;
				p.vY += dT * (force+forceDamp) * cY / absM;

				p.vX += dT * forceDampT * tX / absM;
				p.vY += dT * forceDampT * tY / absM;
			}
		}

		var vAmount = dT * GTE.levelSettings.viscosity;
		if(vAmount > 1){vAmount = 1;}
		for(var i = 0; i < GTE.levelState.particles.length; i++){
			var p = GTE.levelState.particles[i];

			//Gravity force
			p.vY += dT * GTE.levelSettings.g;
	
			//Viscosity force
			p.vX -= vAmount * p.vX;
			p.vY -= vAmount * p.vY;

		}

		//Compare with every other particle
		for(var leafI = 0; leafI < GTE.AABBTree.leaves.length; leafI++){
			var node = GTE.AABBTree.leaves[leafI];
			if(typeof node !== 'object' || typeof node.particles !== 'object'){return;}

			var unresolved = true;
			while(unresolved){
				unresolved = false;
				for(var i = 0; i < node.particles.length; i++){
					var p = node.particles[i];
					if(p.toRemove){
						var index = node.particles.indexOf(p);
						if(index >= 0){
							node.particles.splice(index,1);
							i--;
						}

						index = GTE.levelState.particles.indexOf(p);
						if(index >= 0){
							GTE.levelState.particles.splice(index,1);
						}
						continue;
					}

					var pA  = p;
					var vxA = pA.vX;
					var vyA = pA.vY;

					var mA  = pA.m;
					var rA  = pA.r;
					
					var pXNew = pA.x;
					var pYNew = pA.y;

					var xA = pA.x;
					var yA = pA.y;
					
					if(!p.resolved){
						pXNew += dT*p.vX;
						pYNew += dT*p.vY;

						xA += dT*vxA;
						yA += dT*vyA;
					}

					p.toRemove = false;

					for(var j = 0; j < node.particles.length; j++){
						var pB = node.particles[j];
						if(pB === pA){continue;} //same particle check
						if(pB.toRemove){continue;}

						var rB  = pB.r;
						var rAB2 = (rA+rB)*(rA+rB);
						var distNow2 = Math.pow(pB.x-pA.x,2)+Math.pow(pB.y-pA.y,2);
						// if(distNow2 > rAB2){continue;}

						// if(pA.x < 1 && pB.x > 1 || pA.x > 1 && pB.x < 1){continue;}
						var vxB = pB.vX;
						var vyB = pB.vY;
						var mB  = pB.m;

						var xB = pB.x + dT*vxB;
						var yB = pB.y + dT*vyB;

						var dist2 = Math.pow(xB-xA,2) + Math.pow(yB-yA,2);
						if(dist2 > rAB2){continue;}

						var dist = Math.sqrt(dist2);
						var distNow = Math.sqrt(distNow2);

						if(dist < rA + rB){
							var annihilates = annihilate && mA*mB*(pA.x-1)*(pB.x-1) < 0;
							var combines = Math.abs(pB.m) < GTE.levelSettings.massMax && Math.abs(pA.m) < GTE.levelSettings.massMax && combine && pA.m*pB.m > 0;
							
							//TODO: fix combine
							if(annihilates || combines){

								GTE.pCanvases[pA.id] = undefined;
								GTE.pCanvases[pB.id] = undefined;

								var massTransfer = pA.m;
								pA.toRemove = true;

								if(combines && Math.abs(pA.m+pB.m) > GTE.levelSettings.massMax){
									massTransfer = Math.abs(pA.m+pB.m) - GTE.levelSettings.massMax;

									if(pB.m > 0){
										massTransfer = pA.m - massTransfer;
									}else{
										massTransfer = pA.m + massTransfer;	
									}
									pA.toRemove = false;
								}
									// console.log(pA.m,pB.m,massTransfer);

								if(Math.abs(pB.m*(pB.x<1?1:-1) + massTransfer*(pA.x<1?1:-1)) < GTE.levelSettings.massSigma){
									pB.toRemove = true;
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

									//Some checks because of rounding errors
									if(Math.abs(pB.m)+GTE.levelSettings.massSigma > GTE.levelSettings.massMax && Math.abs(pB.m) < GTE.levelSettings.massMax){
										pB.m = GTE.sign(pB.m)*GTE.levelSettings.massMax;
									}
									if(Math.abs(pA.m)+GTE.levelSettings.massSigma > GTE.levelSettings.massMax && Math.abs(pA.m) < GTE.levelSettings.massMax){
										pA.m = GTE.sign(pA.m)*GTE.levelSettings.massMax;
									}

									if(Math.abs(pB.m) > GTE.levelSettings.massMax){
										pB.m = GTE.sign(pB.m)*GTE.levelSettings.massMax;
									}
									if(Math.abs(pA.m) > GTE.levelSettings.massMax){
										pA.m = GTE.sign(pA.m)*GTE.levelSettings.massMax;
									}
									// console.log(pB.m,pA.m);

									if(p.toRemove){
										for(var k = 0; k < GTE.levelState.mouseForces.length; k++){
											var f = GTE.levelState.mouseForces[k];
											if(typeof f === 'object' && f.pID == pA.id){
												f.pID = pB.id;
												f.p = pB;
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

							var dV = Math.abs(mA*mB)*Math.sqrt(Math.pow(pA.vX-pB.vX,2)+Math.pow(pA.vY-pB.vY,2));
							GTE.playBounceSound(pA.id,pB.id,dV);
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
					var teleport = false
					if(pYNew - p.r < 0){
						pYNew = p.r - pYNew + p.r;
						p.vY = -p.vY*GTE.levelSettings.CoeffRestitution;

						teleport = true;
					}

					//Bottom box collision
					if(pYNew + p.r > yLimit){
						pYNew = yLimit-(p.r + pYNew-yLimit) - p.r;
						p.vY = -p.vY*GTE.levelSettings.CoeffRestitution;
					}

					if(transfer){
						if(p.x < 1 && pXNew > 1){
							p.m *= -1;
							GTE.pCanvases[p.id] = undefined;
						}else if(p.x > 1 && pXNew < 1){
							p.m *= -1;
							GTE.pCanvases[p.id] = undefined;
						}
					}else{

						//Left to Right collision
						if(p.x < leftWall && pXNew+p.r > leftWall){
							p.vX = -p.vX * GTE.levelSettings.CoeffRestitution;
							pXNew = leftWall-(p.r + pXNew - leftWall) - p.r;
						}
						
						//Right to Left collision
						if(p.x > rightWall && pXNew-p.r < rightWall){
							p.vX = -p.vX*GTE.levelSettings.CoeffRestitution;
							pXNew = rightWall+(p.r - pXNew + rightWall) + p.r;
						}
					}

					p.x = pXNew;
					p.y = pYNew;

					//Check particle in node Box
					var box = node.box;
					if(p.x-p.r > box[0] && p.x+p.r < box[2] && p.y-p.r > box[1] && p.y+p.r < box[3]){
					}else if(p.x+p.r >= box[0] && p.x-p.r <= box[2] && p.y+p.r >= box[1] && p.y-p.r <= box[3]){
						p.toUpdateTree = true;
					}else{

						//Now outside node box
						//Remove from particles
						var index = node.particles.indexOf(p);
						if(index >= 0){
							node.particles.splice(index,1);
							i--;
						}
						p.toUpdateTree = true;
					}
					p.resolved = true;
				}
			}
		}
		GTE.updateAABBTree();
	}

	GTE.dirtyCanvas = true;
};