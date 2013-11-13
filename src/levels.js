GTE.gameLevels = 
{
	'level0': 
	{
		'description' : 'Begining Level. Very simple to ease new players into game.',
		'levelID' : 0,
		'rounds'  : 6,
		'starReqs': [4,5,6],

		'numParticles'    : 6,
		'numParticlesSTD' : 0.50,
		'viscosity'       : 0.2,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0,
		'r'               : 0.1

	},
	
	'level1': 
	{
		'description' : 'Now add more particles and more rounds.',
		'levelID' : 1,
		'rounds'  : 7,
		'starReqs': [5, 6, 7],

		'numParticles'    : 15,
		'viscosity'       : 0.2,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0,
		'r'               : 0.085
	},
	
	'level2': 
	{
		'description' : 'More particles.  With some initial velocity to show particles can move.',
		'levelID' : 2,
		'rounds'  : 8,
		'starReqs': [6, 7, 8],

		'numParticles'    : 25,
		'viscosity'       : 0.2,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.1,
		'r'               : 0.075
	},
	
	'level3': 
	{
		'description' : 'More, smaller particles and faster.',
		'levelID' : 3,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 40,
		'viscosity'       : 0.2,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.15,
		'r'               : 0.055
	},
	
	'level4': 
	{
		'description' : 'More and smaller',
		'levelID' : 4,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 50,
		'viscosity'       : 0.2,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.15,
		'r'               : 0.05
	},
	
	'level5': 
	{
		'description' : 'More and smaller with more friction.',
		'levelID' : 5,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 60,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.10,
		'r'               : 0.047
	},
	
	'level6': 
	{
		'description' : 'More and smaller.',
		'levelID' : 6,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 75,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.10,
		'r'               : 0.042
	},
	
	'level7': 
	{
		'description' : 'Fewer, but introduce some negative particles.',
		'levelID' : 7,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 12,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.8,
		'v0'              : 0.07,
		'r'               : 0.06
	},
	
	'level8': 
	{
		'description' : 'Some more particles., more likely to be negative',

		'levelID' : 8,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 30,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.7,
		'v0'              : 0.07,
		'r'               : 0.055
	},

	'level9': 
	{
		'description' : 'More, smaller, more negative.',

		'levelID' : 9,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 40,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.5,
		'v0'              : 0.07,
		'r'               : 0.05
	},

	'level10': 
	{
		'description' : 'Fewer particles, but now particles can transfer boundry.',

		'levelID' : 10,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 20,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.5,
		'v0'              : 0.1,
		'r'               : 0.07
	},
	
	'level11': 
	{
		'description' : 'Even Bias, faster and lower viscosity.',

		'levelID' : 11,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 40,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.2,
		'r'               : 0.045
	},
	
	'level12': 
	{
		'description' : 'Fewer, no transfer, but now all negative.',

		'levelID' : 12,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 22,
		'viscosity'       : 0.2,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : -1,
		'v0'              : 0.2,
		'r'               : 0.05
	},
	
	'level13': 
	{
		'description' : 'A lot more, but now transfer and annihilate.',

		'levelID' : 13,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 50,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.65,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.2,
		'r'               : 0.04
	},
	
	'level14': 
	{
		'description' : 'Tons, now with no gravity.',

		'levelID' : 14,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 175,
		'viscosity'       : 0.01,
		'CoeffRestitution': 0.95,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.2,
		'r'               : 0.02,
		'g'               : 0
	},
	
	'level15': 
	{
		'description' : 'Now can transfer',

		'levelID' : 15,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 175,
		'viscosity'       : 0.01,
		'CoeffRestitution': 0.95,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.2,
		'r'               : 0.02,
		'g'               : 0
	},
	
	'level16': 
	{
		'description' : 'Now can annihilate',

		'levelID' : 16,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 175,
		'viscosity'       : 0.01,
		'CoeffRestitution': 0.95,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.2,
		'r'               : 0.02,
		'g'               : 0
	},
	
	'level17': 
	{
		'description' : 'Now can\t annihilate and are all negative',

		'levelID' : 17,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 175,
		'viscosity'       : 0.01,
		'CoeffRestitution': 0.95,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : -1,
		'v0'              : 0.2,
		'r'               : 0.02,
		'g'               : 0
	},
	
	'level18': 
	{
		'description' : 'Large particles, but now introduce fractional values.',

		'levelID' : 18,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 6,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.1,
		'r'               : 0.065,
		'g'               : 0
	},
	
	'level19': 
	{
		'description' : 'More, now can combine.',

		'levelID' : 19,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 20,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.1,
		'r'               : 0.065,
		'g'               : 0
	},
	
	'level20': 
	{
		'description' : 'More, smaller, and some negative.',

		'levelID' : 20,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 40,
		'viscosity'       : 0.15,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.8,
		'v0'              : 0.08,
		'r'               : 0.05,
		'g'               : 0
	},
	
	'level21': 
	{
		'description' : 'More, smaller, and now some gravity.',

		'levelID' : 21,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 60,
		'viscosity'       : 0.15,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.8,
		'v0'              : 0.08,
		'r'               : 0.045,
		'g'               : 0.05
	},
	
	'level22': 
	{
		'description' : 'More, smaller, now no combine, but transfer.',

		'levelID' : 22,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 80,
		'viscosity'       : 0.15,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.8,
		'v0'              : 0.08,
		'r'               : 0.035,
		'g'               : 0.08
	}
};

GTE.levelCoords = [
					[0.9/4,1-0.3/4],
					[1.7/4,1-0.4/4],
					[2.5/4,1-0.8/4],
					[3.0/4,1-1.0/4],
					[3.2/4,1-1.5/4],
					[3.9/4,1-1.9/4],
					[3.5/4,1-2.5/4],
					[2.8/4,1-2.2/4],
					[2.1/4,1-1.8/4],
					[1.9/4,1-2.3/4],
					[2.7/4,1-2.8/4],
					[2.9/4,1-3.1/4],
					[2.2/4,1-3.4/4],
					[1.6/4,1-3.4/4],
					[1.1/4,1-3.0/4],
					[1.2/4,1-2.2/4],
					[0.6/4,1-2.0/4],
					[0.2/4,1-2.5/4],
					[0.3/4,1-3.3/4],
					[0.7/4,1-3.8/4],
					[1.2/4,1-4.0/4],
					[1.9/4,1-4.0/4],
					[2.6/4,1-3.9/4],
					[3.2/4,1-4.1/4],
					[2.7/4,1-4.6/4],
					[2.8/4,1-5.1/4],
					[3.5/4,1-5.0/4],
					[3.2/4,1-5.5/4],
					[2.3/4,1-5.4/4],
					[2.0/4,1-5.0/4],
					[1.1/4,1-4.8/4],
					[0.8/4,1-5.4/4],
					[1.4/4,1-5.7/4],
					[1.7/4,1-6.2/4],
					[0.33,-0.68],
					[1.9/4,1-7.0/4],
					[0.60,  -0.72],
					[0.66,  -0.59],
					[0.78,  -0.60],
					[0.80,  -0.76],
					[0.78,  -0.98],
					[0.58,  -0.99],
					[0.47,  -1.09],
					[0.34,  -0.95],
					[0.22,  -0.83],
					[0.13,  -0.68],
					[0.02,  -0.72],
					[-0.02, -0.86],
					[-0.05, -1.01],
					[0.06,  -1.14],
					[0.13,  -1.28] 
					];