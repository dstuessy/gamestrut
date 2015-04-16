
define([
   'libs/game/entities/entityMethods'
], function ( entityMethods ) {

	var TextEntity = function ( options ) {
		
		// ADD ALL OPTIONS
		for (var key in options) {
			
			this[key] = options[key];
			
			// BIND FUNCTIONS TO this OBJECT
			if (typeof this[key] == 'function') {

				this[key] = this[key].bind(this);
			}
		}

		// SETTING DEFAULT OPTIONS
		this.type = 'Text';
		this.x = this.x || 0;
		this.y = this.y || 0;
		this.fontSize = this.fontSize || 20;
		this.fontColor = this.fontColor || 'black';
		this.fontFamily = this.fontFamily || 'Arial';

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

	return TextEntity;
});
