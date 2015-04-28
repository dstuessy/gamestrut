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

		Entity.call( this );

		// ADD ALL OPTIONS
		for (var key in options) {

			this[key] = options[key];

			// BIND FUNCTIONS TO this OBJECT
			if (typeof this[key] == 'function') {

				this[key] = this[key].bind(this);
			}
		}

		// SET PROPERTIES
		this.id = this.id;
		this.type = 'Block';
		this.x = this.x || 0;
		this.y = this.y || 0;
		this.width = this.width || 40;
		this.height = this.height || 40;
		this.level = this.level;

		// TEXTURE STUFF
		this.textures = this.textures || [];
		this.texture = this.texture || this.textures[0] || undefined;
		this.previousTexture = this.texture;
		this.sx = this.sx || 0;
		this.sy = this.sy || 0;
		this.angle = this.angle || 0;
		this.color = this.color || 'green';
		this.zindex = this.zindex || '0';

		// SET SCALE
		this.SCALE = this.SCALE || 40;

		// ADD entityMethod FUNCTIONS
		/*
		for (var key in entityMethods) {

			var func = entityMethods[key];

			this[key] = func.bind(this);
		}
		*/

	   console.log( this );

		// INITIALIZE STUFF
		// COLLISIONS
		this.initCollisions();
		// PHYSICS
		if (typeof this.level != 'undefined') {
			this.initPhysics();
		}
	};

	Block.prototype = Object.create( Entity.prototype );
	Block.prototype.constructor = Block;

	/**
	 * Initializes all the physics properties of
	 * the object.
	 * This essentially adds the object to the box2d
	 * physics engine.
	 *
	 * @return {undefined}
	 */
	Block.prototype.initPhysics = function () {

		// Physics based info
		var fixDef = new box2d.b2FixtureDef();
		fixDef.density = 1;
		fixDef.friction = 0.5;
		var bodyDef = new box2d.b2BodyDef();
		bodyDef.type = box2d.b2Body.b2_staticBody;
		bodyDef.position.x = (this.x + (this.width/2)) / this.SCALE;
		bodyDef.position.y = (this.y + (this.height/2)) / this.SCALE;
		fixDef.shape = new box2d.b2PolygonShape(); // sets type of shape
		fixDef.shape.SetAsBox((this.width / this.SCALE) / 2, (this.height / this.SCALE) / 2); // sets width & height
		this.body = this.level.world.CreateBody(bodyDef);
		this.body.SetUserData(this);
		this.body.CreateFixture(fixDef); // adds the defined body to the defined world.
	};

	return Block;
});
