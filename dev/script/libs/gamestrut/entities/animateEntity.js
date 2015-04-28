
define([
	'Mousetrap',
	'libs/gamestrut/functionalStuff/key',
	'libs/gamestrut/functionalStuff/controller',
	'libs/gamestrut/functionalStuff/collision',
	'libs/gamestrut/functionalStuff/box2dvariables',
	'libs/gamestrut/entities/entity',
	'libs/gamestrut/entities/level'
], function (Mousetrap, Key, Controller, Collision, box2d, Entity, Level) {

	/**
	 * Animate Entity Object 
	 *
	 * Represents an entity in a 'level'.
	 *
	 * @type object
	 */
	var AnimateEntity = function (options) {

		Entity.call( this, options );

		// GENERAL STUFF
		this.type = 'AnimateEntity';

		// ANIMATION STUFF
		this.time = new Date().getTime();

		this.init();
	};

	// SET PROTOTYPE INHERITENCE
	AnimateEntity.prototype = Object.create( Entity.prototype );
	// SET CONSTRUCTOR OF ANIMATE ENTIY PROTOTYPE
	AnimateEntity.prototype.constructor = AnimateEntity;

	return AnimateEntity;
});
