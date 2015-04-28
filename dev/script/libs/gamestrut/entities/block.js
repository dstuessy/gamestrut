// object that allows static entities in the level..
// ..e.g. walls and floors. ////////////////////////////////////////////

define([
	'libs/gamestrut/functionalStuff/box2dvariables',
	'libs/gamestrut/entities/entity',
	'libs/gamestrut/entities/level'
], function (box2d, Entity, Level){

	/**
	 * A block object. Basically an entity
	 * that isn't animated in terms of physics 
	 * but still collides. It will collide
	 * with other objects, but will not react
	 * to any of the physics. 
	 *
	 * i.e. if an AnimateEntity hits a Block,
	 * the Block will not move and neither
	 * will it under the force of gravity. BUT
	 * it will interact physically with the 
	 * AnimateEntity.
	 *
	 * @param {object} options A JSON object containing all the options for the Block object.
	 */
	var Block = function (options) {

		Entity.call( this, options );

		// SET PROPERTIES
		this.type = 'Block';

		console.log( this );

		this.init();
	};

	Block.prototype = Object.create( Entity.prototype );
	Block.prototype.constructor = Block;

	return Block;
});
