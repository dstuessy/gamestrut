
require.config({
	baseUrl: 'script/',
	paths: {
		jquery: 'libs/jquery',
		Mousetrap: 'libs/mousetrap',
		box2dweb: 'libs/box2dweb.min',
		game: 'libs/game/game',
		gamestrut: 'libs/game/gamestrut'
	}
});

require(['main'], function (testgame) {
	testgame();
});
