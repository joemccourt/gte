GTE.initModel = function(){

	GTE.levelState = {
		levelID: GTE.level,
		particles: [],
		forces: [],
		mouseForces: []
	};

	// x: [0,2] (x <= 1 => particle on left side)
	// y: [0,1]

	//Tmp generate particles
	for(var i = 0; i < 20; i++){
		
		do{
			var particle = {
				id: i,
				x: 2*Math.random(),
				y:   Math.random(),
				vX: 0,
				vY: 0,
				m: 1,
				r: 0.05,
				resolved: false
			};

		}while(GTE.isCollision(particle));
		
		GTE.levelState.particles.push(particle);
	}
};

GTE.createMouseForce = function(forceID,pID,x,y){
	var p = GTE.levelState.particles[pID];
	if(typeof p !== 'object'){return;}

	//console.log(Math.sqrt((p.x-x)*(p.x-x)+(p.y-y)*(p.y-y)));
	var force = {
		pID: pID,
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
			var p = GTE.levelState.particles[f.pID];

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
				p.vX += dT * (force+forceDamp) * cX / p.m;
				p.vY += dT * (force+forceDamp) * cY / p.m;
			}
		}

		//Viscocity force
		for(var i = 0; i < GTE.levelState.particles.length; i++){
			var p = GTE.levelState.particles[i];

			p.vX -= dT * (0.3 + Math.abs(p.vX))*p.vX;
			p.vY -= dT * (0.3 + Math.abs(p.vY))*p.vY;
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

				//Left box collision
				if(pXNew - p.r < 0){
					pXNew = p.r - pXNew + p.r;
					p.vX = -p.vX;
				}

				//Right box collision
				if(pXNew + p.r > 2){
					pXNew = 2-(p.r + pXNew - 2) - p.r;
					p.vX = -p.vX;
				}

				//Top box collision
				if(pYNew - p.r < 0){
					pYNew = p.r - pYNew + p.r;
					p.vY = -p.vY;
				}

				//Bottom box collision
				if(pYNew + p.r > 1){
					pYNew = 1-(p.r + pYNew-1) - p.r;
					p.vY = -p.vY;
				}

				//Left to Right collision
				if(p.x < 1 && pXNew + p.r > 1){
					pXNew = 1-(p.r + pXNew - 1) - p.r;
					p.vX = -p.vX;
				}
				
				//Right to Left collision
				if(p.x > 1 && pXNew - p.r < 1){
					pXNew = 1+(p.r - pXNew + 1) + p.r;
					p.vX = -p.vX;
				}

				GTE.updateParticlePos(p, pXNew, pYNew);
				p.resolved = true;
			}
		}
	}
};