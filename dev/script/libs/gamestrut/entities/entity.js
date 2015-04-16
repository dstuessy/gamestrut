
define([
	   'libs/game/functionalStuff/box2dvariables',
	   'libs/game/entities/entityMethods',
	   'libs/game/entities/level'
], function (box2d, entityMethods, Level){

	var Entity = function (options) {

		// ADD ALL OPTIONS
		for (var key in options) {

			this[key] = options[key];

			// BIND FUNCTIONS TO this OBJECT
			if (typeof this[key] == 'function') {

				this[key] = this[key].bind(this);
			}
		}

		// ADD ALL entityMethods FUNCTIONS
		for (var key in entityMethods) {
			
			this[key] = entityMethods[key];
		}
	};


	return Entity;
});
