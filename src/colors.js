GTE.colors = {
	'red'    : {r:255,g:  0,b:  0},
	'green'  : {r:  0,g:255,b:  0},
	'blue'   : {r:  0,g:  0,b:255},
	'yellow' : {r:255,g:255,b:  0},
	'cyan'   : {r:  0,g:255,b:255},
	'purple' : {r:255,g:  0,b:255},
	'white'  : {r:255,g:255,b:255},
	'black'  : {r:  0,g:  0,b:  0},
	'particleBlue'  : {r: 25,g:73,b:204},
	'particleDarkBlue': {r: 35,g:46,b:125},
	'particleRed'   : {r:200,g: 25,b: 54},
	'particleWhite' : {r:211,g:231,b:243},
	'winColor'      : {r:100,g:200,b:100},
	'loseColor'      : {r:200,g:40,b:40},
	'starBronze': {r:150,g:90,b:56},
	'starSilver': {r:204,g:194,b:194},
	'starGold': {r:217,g:164,b:65}
};

GTE.colorToStr = function(color,alpha){
	if(typeof color !== 'object'){return 'red';}

	color.r = Math.round(color.r);
	color.g = Math.round(color.g);
	color.b = Math.round(color.b);
	color.r = color.r < 0 ? 0 : color.r > 255 ? 255 : color.r;
	color.g = color.g < 0 ? 0 : color.g > 255 ? 255 : color.g;
	color.b = color.b < 0 ? 0 : color.b > 255 ? 255 : color.b;

	if(typeof alpha === 'number'){
		return 'rgba('+color.r+','+color.g+','+color.b+','+alpha+')';
	}else{
		return 'rgb('+color.r+','+color.g+','+color.b+')';
	}
};

GTE.negateColor = function(color){
	return {r:255-color.r,g:255-color.g,b:255-color.b};
};

GTE.starColors = [GTE.colors['starBronze'],GTE.colors['starSilver'],GTE.colors['starGold']];
GTE.starColorStr = [GTE.colorToStr(GTE.colors['starBronze']),GTE.colorToStr(GTE.colors['starSilver']),GTE.colorToStr(GTE.colors['starGold'])];

GTE.colorSets = {
	'pastels' : 
	[
		{r:205,g:255,b:149},
		{r:255,g:171,b: 97},
		{r:157,g:237,b:243},
		{r:223,g:253,b:255},
		{r: 34,g:133,b:187}
	],

	'primaries' :
	[
		GTE.colors['red'],
		GTE.colors['green'],
		GTE.colors['blue'],
		GTE.colors['yellow'],
		GTE.colors['cyan'],
		GTE.colors['purple'],
		GTE.colors['white'],
		GTE.colors['black'],
	],

	'oceanFive' :
	[
		{r:  0,g:160,b:176},
		{r:106,g: 74,b: 60},
		{r:204,g: 51,b: 63},
		{r:235,g:104,b: 65},
		{r:237,g:201,b: 81}
	],

	'melonBallSurprise' :
	[
		{r:209,g:242,b:165},
		{r:239,g:250,b:180},
		{r:255,g:196,b:140},
		{r:255,g:159,b:128},
		{r:245,g:105,b:145}
	],

	'gemtoneSeaShore' :
	[
		{r: 22,g:147,b:165},
		{r:  2,g:170,b:176},
		{r:  0,g:205,b:172},
		{r:127,g:255,b: 36},
		{r:195,g:255,b:104}
	],

	'aKissToAwake' :
	[
		{r:185,g:211,b:176},
		{r:129,g:189,b:164},
		{r:178,g:135,b:116},
		{r:248,g:143,b:121},
		{r:246,g:170,b:147}
	],

	'loveFlowers' :
	[
		{r:125,g:158,b: 60},
		{r:115,g: 88,b: 29},
		{r:255,g:254,b:192},
		{r:255,g:226,b:166},
		{r:254,g:159,b:140}
	],

	'iridescentSunset' :
	[
		{r: 51,g: 19,b: 39},
		{r:153,g: 23,b:102},
		{r:217,g: 15,b:90},
		{r:243,g: 71,b: 57},
		{r:255,g:110,b: 39}
	],

	'popIsEverything' :
	[
		{r:170,g:255,b:  0},
		{r:255,g:170,b:  0},
		{r:255,g:  0,b:170},
		{r:170,g:  0,b:255},
		{r:  0,g:170,b:255}
	]

};