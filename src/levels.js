GTE.gameLevels = 
{
	'level0': 
	{
		'description' : 'Begining Level. Very simple to ease new players into game.',
		'levelID' : 0,
		'rounds'  : 6,
		'starReqs': [4,5,6],

		'numParticles'    : 5,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0

	},
	
	'level1': 
	{
		'description' : 'Now add more particles and more rounds.',
		'levelID' : 1,
		'rounds'  : 7,
		'starReqs': [5, 6, 7],

		'numParticles'    : 15,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0

	},
	
	'level2': 
	{
		'description' : 'Even more particles.  With some initial velocity to show particles can move.',
		'levelID' : 2,
		'rounds'  : 8,
		'starReqs': [6, 7, 8],

		'numParticles'    : 30,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.1
	},
	
	'level3': 
	{
		'description' : 'More, smaller particles and faster. Plus lower viscosity',
		'levelID' : 3,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 70,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.15,
		'r'               : 0.03
	},
	
	'level4': 
	{
		'description' : 'Fewer and larger, but now they stack to 2.',
		'levelID' : 3,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 20,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 2,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.15,
		'r'               : 0.05
	},
	
	'level5': 
	{
		'description' : 'Some more and stack up to 5.',
		'levelID' : 3,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 30,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.10,
		'r'               : 0.04
	},
	
	'level6': 
	{
		'description' : 'Start up to 5, stack up to 10',
		'levelID' : 3,
		'rounds'  : 10,
		'starReqs': [7, 9, 10],

		'numParticles'    : 40,
		'viscosity'       : 0.3,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 10,
		'initMassMax'     : 5,
		'signBias'        : 1,
		'v0'              : 0.10,
		'r'               : 0.035
	},
	
	'level7': 
	{
		'levelID' : 7,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 12,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.07
	},
	
	'level7': 
	{
		'levelID' : 7,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 12,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.07
	},
	
	'level8': 
	{
		'levelID' : 8,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 20,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : true,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.07
	},
	
	'level9': 
	{
		'levelID' : 9,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 20,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : true,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.07
	},
	
	'level10': 
	{
		'levelID' : 10,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 20,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : true,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : false,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.1
	},
	
	'level11': 
	{
		'levelID' : 11,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 40,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : true,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : false,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.07
	},
	
	'level12': 
	{
		'levelID' : 12,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 50,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 5,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.07
	},
	
	'level13': 
	{
		'levelID' : 13,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 50,
		'viscosity'       : 0.7,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 5,
		'initMassMax'     : 3,
		'signBias'        : 0,
		'v0'              : 0.07
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