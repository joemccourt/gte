GTE.colors = {
	'red'    : {r:255,g:  0,b:  0},
	'green'  : {r:  0,g:255,b:  0},
	'blue'   : {r:  0,g:  0,b:255},
	'yellow' : {r:255,g:255,b:  0},
	'cyan'   : {r:  0,g:255,b:255},
	'purple' : {r:255,g:  0,b:255},
	'white'  : {r:255,g:255,b:255},
	'black'  : {r:  0,g:  0,b:  0}
};

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
	]

};