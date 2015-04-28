// object that allows static entities in the level..
// ..e.g. walls and floors. ////////////////////////////////////////////

define([
	'libs/gamestrut/functionalStuff/box2dvariables',
	'libs/gamestrut/entities/entity',
	'libs/gamestrut/entities/level'
], function (box2d, Entity, Level){

	/**
	 * A StaticEntity object. Basically an entity
	 * that isn't animated in terms of physics 
	 * but still collides. It will collide
	 * with other objects, but will not react
	 * to any of the physics. 
	 *
	 * i.e. if an AnimateEntity hits a StaticEntity,
	 * the StaticEntity will not move and neither
	 * will it under the force of gravity. BUT
	 * it will interact physically with the 
	 * AnimateEntity.
	 *
	 * @param {object} options A JSON object containing all the options for the StaticEntity object.
	 */
	var StaticEntity = function (options) {

		Entity.call( this, options );

		// SET PROPERTIES
		this.type = 'StaticEntity';

		this.init();
	};

	StaticEntity.prototype = Object.create( Entity.prototype );
	StaticEntity.prototype.constructor = StaticEntity;

	return StaticEntity;
});
