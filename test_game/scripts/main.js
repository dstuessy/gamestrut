
require.config({
   baseUrl: 'scripts/',
   paths: {
      jquery: 'libs/jquery',
      Mousetrap: 'libs/mousetrap',
      box2dweb: 'libs/box2dweb.min',
      game: 'libs/game/game'
   }
});

require(['script'], function (asteroids) {
   asteroids();
});
