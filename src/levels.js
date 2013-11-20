GTE.gameLevels = 
{
	'default':
	{
		'levelID': 0,
		'rounds': 10,
		'starReqs': [7, 9, 10],
		'viscosity': 0.02,
		'CoeffRestitution': 0.6,
		'annihilate': false,
		'combine': true,
		'transfer': false,
		'integerMass': false,
		'massSigma': 0.001,
		'massMax': 100,
		'initMassMax': 3,
		'initMassMin': 0.1,
		'numParticles': 20,
		'numParticlesSTD': 0.10,
		'signBias': 0,
		'v0': 0,
		'r': 0.05,
		'g': 0
	},

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
		'numParticlesSTD' : 0.4,
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
		'r'               : 0.05,
	},
	
	'level13': 
	{
		'description' : 'More',

		'levelID' : 12,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 45,
		'numParticlesSTD' : 0.4,
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
		'r'               : 0.04
	},

	'level14':
	{
		'description' : 'All positive, with gravity',

		'levelID' : 14,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 50,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.65,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.2,
		'r'               : 0.04,
		'g'               : 0.08
	},
	
	'level15':
	{
		'description' : 'More gravity, more particles, more viscosity.',

		'levelID' : 15,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 70,
		'viscosity'       : 0.2,
		'CoeffRestitution': 0.65,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.2,
		'r'               : 0.04,
		'g'               : 0.12
	},
	
	'level16':
	{
		'description' : 'More gravity, more particles, more viscosity, even negative positive.',

		'levelID' : 16,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 85,
		'viscosity'       : 0.5,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.2,
		'r'               : 0.05,
		'g'               : 0.18
	},
	
	'level17':
	{
		'description' : 'More gravity, more particles, less viscosity.  Smaller.',

		'levelID' : 17,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 100,
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
		'r'               : 0.05,
		'g'               : 0.2
	},
	
	'level18':
	{
		'description' : 'Bigger, no gravity and high viscosity.',

		'levelID' : 18,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 90,
		'viscosity'       : 0.6,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.2,
		'r'               : 0.06
	},

	'level19':
	{
		'description' : 'Now some more, but tiny.',

		'levelID' : 19,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 110,
		'viscosity'       : 0.6,
		'CoeffRestitution': 0.5,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.2,
		'r'               : 0.02
	},
	
	'level20': 
	{
		'description' : 'Large particles, but now introduce fractional values.',

		'levelID' : 20,
		'rounds'  : 7,
		'starReqs': [4, 5, 7],

		'numParticles'    : 7,
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

	'level21': 
	{
		'description' : 'More particles.',

		'levelID' : 21,
		'rounds'  : 8,
		'starReqs': [5, 7, 8],

		'numParticles'    : 25,
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
		'r'               : 0.06,
		'g'               : 0
	},
	
	'level22':
	{
		'description' : 'More more more.',

		'levelID' : 22,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 100,
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
		'r'               : 0.04,
		'g'               : 0
	},

	'level23':
	{
		'description' : 'More and can transfer.',

		'levelID' : 23,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 120,
		'viscosity'       : 0.08,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.4,
		'r'               : 0.038,
		'g'               : 0
	},

	'level24':
	{
		'description' : 'Now negative',

		'levelID' : 24,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 120,
		'viscosity'       : 0.08,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.4,
		'r'               : 0.04,
		'g'               : 0
	},

	'level25':
	{
		'description' : 'Only negative, and can\'t transfer',

		'levelID' : 25,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 125,
		'viscosity'       : 0.08,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : -1,
		'v0'              : 0.4,
		'r'               : 0.04,
		'g'               : 0
	},


	'level26':
	{
		'description' : 'Now can\'t combine',

		'levelID' : 26,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 125,
		'viscosity'       : 0.08,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : -1,
		'v0'              : 0.4,
		'r'               : 0.04,
		'g'               : 0
	},

	'level27':
	{
		'description' : 'Integer, possitive, fewer, larger, can go up to mass of 2 now',

		'levelID' : 27,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 15,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 2,
		'initMassMax'     : 2,
		'signBias'        : 1,
		'v0'              : 0.1,
		'r'               : 0.07,
		'g'               : 0
	},

	'level28':
	{
		'description' : 'More, smaller, faster, up to 3',

		'levelID' : 28,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 70,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 3,
		'initMassMax'     : 3,
		'signBias'        : 1,
		'v0'              : 0.1,
		'r'               : 0.04,
		'g'               : 0
	},

	'level29':
	{
		'description' : 'More, up to 5',

		'levelID' : 29,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 90,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 5,
		'signBias'        : 1,
		'v0'              : 0.1,
		'r'               : 0.04,
		'g'               : 0
	},

	'level30':
	{
		'description' : 'Larger, up to 10',

		'levelID' : 30,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 100,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 10,
		'initMassMax'     : 10,
		'signBias'        : 1,
		'v0'              : 0.1,
		'r'               : 0.06,
		'g'               : 0
	},

	'level31':
	{
		'description' : 'Up to 100!',

		'levelID' : 31,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 100,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 100,
		'initMassMax'     : 3,
		'signBias'        : 1,
		'v0'              : 0.4,
		'r'               : 0.1,
		'g'               : 0
	},

	'level32':
	{
		'description' : 'Back to 5 max, but can transfer',

		'levelID' : 32,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 100,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 5,
		'signBias'        : 1,
		'v0'              : 0.2,
		'r'               : 0.04,
		'g'               : 0
	},

	'level33':
	{
		'description' : 'More, equal bias',

		'levelID' : 33,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 120,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 5,
		'signBias'        : 0,
		'v0'              : 0.2,
		'r'               : 0.035,
		'g'               : 0
	},

	'level34':
	{
		'description' : 'Back, only up to one, can annihilate.',

		'levelID' : 34,
		'rounds'  : 6,
		'starReqs': [4, 5, 6],

		'numParticles'    : 30,
		'viscosity'       : 0.1,
		'CoeffRestitution': 0.6,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0.5,
		'v0'              : 0.05,
		'r'               : 0.09,
		'g'               : 0
	},

	'level35':
	{
		'description' : 'A lot, very small and fast',

		'levelID' : 35,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 140,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.9,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.4,
		'r'               : 0.02,
		'g'               : 0
	},

	'level36':
	{
		'description' : 'Even smaller and transfer',

		'levelID' : 36,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 140,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.9,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.4,
		'r'               : 0.015,
		'g'               : 0
	},

	'level37':
	{
		'description' : 'Fewer, but now have fractional values',

		'levelID' : 37,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 80,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.9,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.4,
		'r'               : 0.05,
		'g'               : 0
	},

	'level38':
	{
		'description' : 'More, max mass up to 3',

		'levelID' : 38,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 100,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.9,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 3,
		'initMassMax'     : 3,
		'signBias'        : 0.3,
		'v0'              : 0.4,
		'r'               : 0.05,
		'g'               : 0
	},

	'level39':
	{
		'description' : 'Can transfer, max mass up to 5.  Slow and very high viscosity.',

		'levelID' : 39,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 130,
		'viscosity'       : 8,
		'CoeffRestitution': 0.8,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : false,
		'massMax'         : 5,
		'initMassMax'     : 5,
		'signBias'        : 0,
		'v0'              : 0,
		'r'               : 0.035,
		'g'               : 0
	},

	'level40':
	{
		'description' : 'More, very tiny, only up to 1, lower viscosity',

		'levelID' : 40,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 160,
		'viscosity'       : 0.5,
		'CoeffRestitution': 0.8,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0,
		'r'               : 0.02,
		'g'               : 0
	},

	'level41':
	{
		'description' : 'Smaller and high viscosity again',

		'levelID' : 41,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 250,
		'viscosity'       : 8,
		'CoeffRestitution': 0,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0,
		'r'               : 0.015,
		'g'               : 0
	},

	'level42':
	{
		'description' : 'Tiny, low viscosity, slow initial',

		'levelID' : 42,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 250,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.8,
		'annihilate'      : true,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.003,
		'r'               : 0.012,
		'g'               : 0
	},

	'level43':
	{
		'description' : 'No annihilate and no transfer, all negative',

		'levelID' : 43,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 250,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : -1,
		'v0'              : 0.003,
		'r'               : 0.012,
		'g'               : 0
	},

	'level44':
	{
		'description' : 'Now zero bias',

		'levelID' : 44,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 250,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.003,
		'r'               : 0.012,
		'g'               : 0
	},

	'level45':
	{
		'description' : 'Combine up to 5',

		'levelID' : 45,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 250,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 5,
		'initMassMax'     : 5,
		'signBias'        : 0,
		'v0'              : 0.003,
		'r'               : 0.012,
		'g'               : 0
	},

	'level46':
	{
		'description' : 'Fraction, up to 1.  Even more particles',

		'levelID' : 46,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 300,
		'viscosity'       : 0.03,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : false,
		'integerMass'     : false,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.003,
		'r'               : 0.012,
		'g'               : 0
	},

	'level47':
	{
		'description' : 'Small, fast, transfer',

		'levelID' : 47,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 350,
		'viscosity'       : 0.08,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : true,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.3,
		'r'               : 0.012,
		'g'               : 0
	},

	'level48':
	{
		'description' : 'Same as before, but negated bias',

		'levelID' : 48,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 350,
		'viscosity'       : 0.08,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : -1,
		'v0'              : 0.2,
		'r'               : 0.010,
		'g'               : 0
	},


	'level49':
	{
		'description' : 'A ton of particles',

		'levelID' : 49,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 500,
		'viscosity'       : 0.08,
		'CoeffRestitution': 0.8,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : true,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 0,
		'v0'              : 0.3,
		'r'               : 0.010,
		'g'               : 0
	},

	'level50':
	{
		'description' : 'This is crazy, probably won\'t run well on most computers',

		'levelID' : 50,
		'rounds'  : 11,
		'starReqs': [7, 9, 11],

		'numParticles'    : 1000,
		'viscosity'       : 0.01,
		'CoeffRestitution': 0.9,
		'annihilate'      : false,
		'combine'         : false,
		'transfer'        : false,
		'integerMass'     : true,
		'massMax'         : 1,
		'initMassMax'     : 1,
		'signBias'        : 1,
		'v0'              : 0.3,
		'r'               : 0.008,
		'g'               : 0
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