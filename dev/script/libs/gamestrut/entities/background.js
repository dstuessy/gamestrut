
define([
	'libs/game/entities/entityMethods'
], function ( entityMethods ) {

	var Background = function ( options ) {

		// ADD ALL OPTIONS
		for (var key in options) {
			
			this[key] = options[key];
			
			// BIND FUNCTIONS TO this OBJECT
			if (typeof this[key] == 'function') {

				this[key] = this[key].bind(this);
			}
		}

		// SET DEFAULT OPTIONS
		this.type = 'Background';
		this.texture = options.texture;
		this.color = options.color || 'black';
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.width = ( typeof this.texture != 'undefined' ) ? this.texture.width : 0;
		this.height = ( typeof this.texture != 'undefined' ) ? this.texture.height : 0;

		// ADD ALL entityMethods FUNCTIONS
		for (var key in entityMethods) {
			
			var func = entityMethods[key];

			this[key] = func.bind(this);
		}

		// INITIALIZE STUFF
		// COLLISIONS
		this.initCollisions();
		// CONTROLLERS
		this.initControllers();
	};

	return Background;
});
