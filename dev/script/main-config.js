
require.config({
	baseUrl: 'script/',
	paths: {
		//jquery: 'libs/jquery',
		Mousetrap: 'libs/mousetrap',
		box2dweb: 'libs/box2dweb.min',
		game: 'libs/gamestrut/game',
		gamestrut: 'libs/gamestrut/gamestrut'
	}
});

require(['main'], function (testgame) {
	testgame();
});
