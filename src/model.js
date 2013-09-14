GTE.initModel = function(){

	GTE.levelSettings = {
		'viscosity' : 1,    //1 / (1+GTE.gameDifficulty);
		'CoeffRestitution' : 0.6, //0.7*(1 - 1 / (1+GTE.gameDifficulty));
		'annihilate' : false,
		'combine' : true,
		'transfer' : false,
		'massSigma' : 0.001,
		'massMax' : 5
	};


	var v0 = 0;//(1+GTE.gameDifficulty) * 0.003;
	var N = 2 + GTE.gameDifficulty;

	console.log("Level: " + GTE.level + ", Difficulty: " + GTE.gameDifficulty);
	GTE.levelState = {
		levelID: GTE.level,
		particles: [],
		forces: [],
		mouseForces: []
	};

	// x: [0,2] (x <= 1 => particle on left side)
	// y: [0,1]

	//Tmp generate particles
	for(var i = 0; i < N; i++){
		
		do{
			var sign = (Math.random()*2|0)*2 - 1;
			var angle = Math.random() * Math.PI * 2;
			var vX = v0 * Math.cos(angle);
			var vY = v0 * Math.sin(angle);
			var particle = {
				id: i,
				x: 2*Math.random(),
				y:   Math.random(),
				vX: vX,
				vY: vY,
				m: GTE.levelSettings.massMax*sign*Math.random(),
				r: 0.05,
				resolved: false
			};

		}while(GTE.isCollision(particle));
		
		GTE.levelState.particles.push(particle);
	}
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
		k: 35,
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

GTE.updateModel = function(deltaTime){

	while(deltaTime > 0){

		var dT = Math.min(5,deltaTime) / 500;
		deltaTime -= 5;

		//Set all particles unresolved
		GTE.setParticlesUnresolved();

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

			var force = f.k*dr;

			var vF = p.vX*cX+p.vY*cY;
			var forceDamp = -0;//Math.sqrt(4 * f.k * p.m) * vF;

			if(dr > 0){
				p.vX += dT * (force+forceDamp) * cX / Math.abs(p.m);
				p.vY += dT * (force+forceDamp) * cY / Math.abs(p.m);
			}
		}

		//Viscosity force
		for(var i = 0; i < GTE.levelState.particles.length; i++){
			var p = GTE.levelState.particles[i];

			p.vX -= dT * GTE.levelSettings.viscosity * (0.3 + Math.abs(p.vX))*p.vX;
			p.vY -= dT * GTE.levelSettings.viscosity * (0.3 + Math.abs(p.vY))*p.vY;
		}

		//Update positions
		var unresolved = true;
		while(unresolved){
			unresolved = false;
			for(var i = 0; i < GTE.levelState.particles.length; i++){
				var p = GTE.levelState.particles[i];
				if(p.resolved){continue;}

				//Collision check
				var pXNew = p.x + dT*p.vX;
				var pYNew = p.y + dT*p.vY;

				var pA = p;
				var vxA = pA.vX;
				var vyA = pA.vY;

				var xA  = pA.x + dT*vxA;
				var yA  = pA.y + dT*vyA;

				var mA  = pA.m;
				var rA  = pA.r;

				var toRemove = false;

				//Inefficient TODO: use AABB tree
				for(var j = i+1; j < GTE.levelState.particles.length; j++){
					var pB = GTE.levelState.particles[j];

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

							if(Math.abs(pB.m - massTransfer) < GTE.levelSettings.massSigma){
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
				if(pYNew + p.r > 1){
					pYNew = 1-(p.r + pYNew-1) - p.r;
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

				GTE.updateParticlePos(p, pXNew, pYNew);
				p.resolved = true;
			}
		}
	}
};