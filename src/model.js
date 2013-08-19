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
				r: 0.03
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
		k: 15,
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

GTE.updateModel = function(deltaTime){

	while(deltaTime > 0){

		var dT = Math.min(5,deltaTime) / 100;
		deltaTime -= 5;

		//Update forces
		for(var i = 0; i < GTE.levelState.mouseForces.length; i++){
			var f = GTE.levelState.mouseForces[i];
			if(typeof f === "undefined"){continue;}
			var p = GTE.levelState.particles[f.pID];

			var dr = Math.sqrt((p.x-f.fX)*(p.x-f.fX) + (p.y-f.fY)*(p.y-f.fY)); 
			var cX = (f.fX-p.x) / dr;
			var cY = (f.fY-p.y) / dr;

			var force = f.k*dr;

			var vF = p.vX*cX+p.vY*cY;
			var forceDamp = -Math.sqrt(4 * f.k * p.m) * vF;

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
		for(var i = 0; i < GTE.levelState.particles.length; i++){
			var p = GTE.levelState.particles[i];

			//TODO: collision check
			GTE.updateParticlePos(p, p.x + dT*p.vX, p.y + dT*p.vY);
		}
	}
};