/* This is an object that contains all the methods for anything animate */

define([
	'libs/gamestrut/functionalStuff/box2dvariables',
	'libs/gamestrut/functionalStuff/key',
	'libs/gamestrut/functionalStuff/collision',
	'libs/gamestrut/functionalStuff/controller'
], function (box2d, key, Collision, Controller) {

	var Entity = function ( options ) {

		// ADD ALL OPTIONS
		for (var key in options) {

			this[key] = options[key];

			// BIND FUNCTIONS TO this OBJECT
			if (typeof this[key] == 'function') {

				this[key] = this[key].bind(this);
			}
		}

		// SET DEFAULTS
		this.id = this.id;
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
	};

	/**
	 * Initialize certain properties
	 * that require the general properties to
	 * be set. e.g. collisions and controllers
	 * require a list of collision and 
	 * controller listeners to be set previously.
	 *
	 * @return undefined
	 */
	Entity.prototype.init = function () {

		// INITIALIZE STUFF
		
		// collision
		this.initCollisions();
		// controllers 
		this.initControllers();
		// physics
		if (
			(
				this.type == 'AnimateEntity'
				||
				this.type == 'StaticEntity'
			)
			&&
			typeof this.level != 'undefined'
		) {
			this.initPhysics();
		}
	};

	/**
	 * Initializes all the physics properties of
	 * the object.
	 * This essentially adds the object to the box2d
	 * physics engine.
	 *
	 * @return {undefined}
	 */
	Entity.prototype.initPhysics = function () {

		// SET BODY TYPE BASED ON ENTITY TYPE
		var type = (this.type == 'AnimateEntity') ? box2d.b2Body.b2_dynamicBody : box2d.b2Body.b2_staticBody;

		/* Physics Stuff */
		var fixDef = new box2d.b2FixtureDef();
		fixDef.density = this.density || 1;
		fixDef.restitution = this.restitution || 0;
		fixDef.friction = this.friction || 0.5;

		var bodyDef = new box2d.b2BodyDef();
		bodyDef.type = type;
		bodyDef.position.x = (this.x + (this.width/2)) / this.SCALE;
		bodyDef.position.y = (this.y + (this.height/2)) / this.SCALE;
		bodyDef.angle = this.angle;

		fixDef.shape = new box2d.b2PolygonShape(); // sets type of shape
		fixDef.shape.SetAsBox((this.width / this.SCALE) / 2, (this.height / this.SCALE) / 2); // sets width & height

		this.body = this.level.world.CreateBody(bodyDef);
		this.body.SetUserData(this);
		this.body.CreateFixture(fixDef); // adds the defined body to the defined world.
	};

	/**
	 * Sets an attibute to the animate entity.
	 *
	 * If attibute is a function, it is 
	 * nested within a wrapper function that 
	 * allows the executed function to refer to
	 * 'this' as the animate entity.
	 *  
	 * @param {string} key String representing the key of the attribute.
	 * @param {any} key Any data type to be set under the key.
	 * @return {undefined}
	 */
	Entity.prototype.set = function (key, attribute) {

		// CHECK THAT attribute ISN'T UNDEFINED
		if (typeof attribute == 'undefined') {
			// ERROR OUTPUT
			console.log('cannot set undefined to level. ' + key + ' is undefined.');
			return;
		}

		// IF attribute IS FUNCTION
		if (typeof attribute == 'function') {
			// ADD FUNCTION TO LEVEL WITH A WRAPPER THAT BINDS 'this' 
			// TO THE FUNCTIONS SCOPRE AS ITS PARAMETER
			this[key] = attribute.bind(this);
		} else {
			// SET attribute UNDER key
			this[key] = attribute;
		}
	};

	/**
	 * Returns the position of the given entity.
	 *
	 * x and y coordinates are translated into the canvas' scale.
	 *
	 * x and y coordinates are centered to the entity.
	 * 
	 * @return {object}     An object holding the translated coordinates of the given entity.
	 */
	Entity.prototype.getPosition = function () {

		// GET POSITION FROM BOX2D BODY 
		var x = this.body.GetPosition().x * this.SCALE;
		var y = this.body.GetPosition().y * this.SCALE;

		// RETURN POSITION
		return { x:x, y:y };
	};

	/**
	 * Returns the angle of the given entity in radians.
	 * 
	 * @return {float}     The angle in radians of the given entity.
	 */
	Entity.prototype.getAngle = function () {
		return this.body.GetAngle();
	};

	/**
	 * Sets the position of the entity.
	 *
	 * x and y are set to box2d body's scale.
	 *
	 * x and y are centered to animateEntity's dimensions.
	 *
	 * @param {object} pos JSON object with x and y coordinate values. Either is optional.
	 *
	 * @return {undefined}
	 */
	Entity.prototype.setPosition = function (pos) {

		// IF POS IS DEFINED
		if (typeof pos != 'undefined') {

			this.body.SetAwake(true);

			// GET X AND Y POSITIONS
			var x = pos.x || this.getPosition().x;
			var y = pos.y || this.getPosition().y;

			// SET X AND Y POSITIONS TO SCALE FOR PHYSICS ENGINE
			x = x / this.SCALE;
			y = y / this.SCALE;

			// ADD X AND Y TO VECTOR OBJECT
			pos = new box2d.b2Vec2(x, y);

			// SET THE BOX2D BODY POSITION
			this.body.SetPosition( pos );
		}
	};

	/**
	 * Sets angle of object's box2d boxy.
	 *
	 * @param {number} angle Number representing degrees in Radian.
	 * @return {undefined}
	 */
	Entity.prototype.setAngle = function (angle) {

		// WAKE UP BODY
		this.body.SetAwake(true);
		// RESET ANGULAR PHYSICS
		this.body.SetAngularVelocity(0);
		// SET ANGLE
		this.body.SetAngle(angle);
	};

	/**
	 * Sets the angular velocity of 
	 * the object's box2d body.
	 *
	 * @param {number} angle Number representing degrees in Radian.
	 * @return {undefined}
	 */
	Entity.prototype.setAngularVelocity = function (angle) {

		// WAKE UP BODY
		this.body.SetAwake(true);
		// SET ANGULAR VELOCITY
		this.body.SetAngularVelocity(angle);
	};

	/**
	 * Sets linear velocity of object's box2d body.
	 *
	 * @param {object} vals Object holding x and y values.
	 * @return {undefined}
	 */
	Entity.prototype.setLinearVelocity = function (vals) {

		// WAKE UP BODY
		this.body.SetAwake(true);

		// SET LINEAR VELOCITY 
		this.body.GetLinearVelocity().x = vals.x || this.body.GetLinearVelocity().x;
		this.body.GetLinearVelocity().y = vals.y || this.body.GetLinearVelocity().y;
	};

	/**
	 * Adds a texture to the texture array.
	 *
	 * @param {string} textureID  The ID of the texture e.g. 'running'.
	 * @param {string} textureURL The URL of the texture e.g. 'images/player.png'.
	 */
	Entity.prototype.addTexture = function (textureID,textureURL) {

		var image = new Image();
		image.src = textureURL;

		this.textures[textureID] = image;
	};

	/**
	 * Sets the current texture.
	 *
	 * @param {string} textureID The ID of the texture e.g. 'running'.
	 */
	Entity.prototype.setTexture = function (textureID) {

		if (typeof this.texture != 'undefined') {

			this.texture = this.textures[textureID];
		} else {

			this.texture = this.textures[textureID];
			this.previousTexture = this.texture;
		}
	};

	/**
	 * Set level of an entity.
	 * Initialize physics of entity if it has the function.
	 *
	 * @return {undefined}
	 */
	Entity.prototype.setLevel = function (level) {

		// ADD LEVEL IF IT'S DEFINED AND OF TYPE 'level'
		if (typeof level != 'undefined' && level.type == 'Level') {

			this.level = level;

			if ( typeof this.initPhysics == 'undefined' ) return;
			this.initPhysics();
		}
		else {

			// ERROR OUTPUT
			console.log(level);
			console.log('could not set above ' + level + ' as level.');
		}
	};

	/**
	 * Initialize the controller listeners.
	 *
	 * @return undefined
	 */
	Entity.prototype.initControllers = function () {

		// SET UP CONTROLLERS
		for (var controllerIndex in this.controllers) {

			// GET CONTROLLER
			var controller = this.controllers[controllerIndex];

			// SET CONTROLLER VALUES
			var event = controller.event;
			var key = controller.key;
			var preventDefault = controller.preventDefault;
			var oneTimePress = controller.oneTimePress;
			var execute = controller.execute;
			// SET EXECUTE TO FUNCTION IN OBJECT
			// OR BIND THE NEW FUNCTION TO THE OBJECT
			execute = (
				typeof execute == 'string' 
				&& 
					typeof this[execute] != 'undefined'
			) ? this[execute] : execute.bind(this);

			// CREATE CONTROLLER
			this.controllers[controllerIndex] = new Controller(key, execute, event, oneTimePress, preventDefault);
		}
	};

	/**
	 * Initializes all collision listeners for the animate entity.
	 *
	 * @return {undefined}
	 */
	Entity.prototype.initCollisions = function () {

		this.collisions = this.collisions || [];

		// FOR EACH CONTROLLER OF THIS ANIMATE ENTITY
		for (var eventString in this.collisions) {

			var i = i || 0;
			var tempArray = tempArray || [];
			var event = this.collisions[eventString];

			for (var objBId in event) {

				// GET EXECUTE
				var execute = event[objBId]; 
				// SET EXECUTE EITHER AS FUNCTION OF this OR CLOSURE
				execute = (typeof execute == 'string') ? this[execute] : execute.bind(this);

				// CREATE COLLISION FUNCTION
				tempArray[i] = new Collision(eventString, this.id, objBId, execute);
				i++;
			}
		}

		// SET COLLISIONS
		this.collisions = tempArray || [];
	};

	/* painter's algorithm:
	 * the sword, shield, and body are drawn in an order
	 * depending on the direction the animateEntity is 
	 * facing.
	 */
	Entity.prototype.draw = function (context) {

		// DRAW FOR ANIMATE ENTITY
		if (this.type == 'AnimateEntity' && !this.dead) {

			this.drawBody(context);
		}

		// DRAW FOR StaticEntity
		if (this.type == 'StaticEntity') {
			this.drawBody( context );
		}

		// DRAW FOR BACKGROUND
		if ( this.type == 'Background' ) {
			this.drawBody( context );
		}

		// DRAW FOR TEXT
		if (this.type == 'Text') {
			this.drawBody( context );
		}
	};

	Entity.prototype.drawBody = function (context) {

		// DRAW TEXT IF TEXT ENTITY

		if (this.type == 'Text') {

			// DRAW TEXT
			context.font = this.fontSize + 'px ' + this.fontFamily;
			context.fillStyle = this.fontColor;
			context.fillText( this.text, this.x, this.y );

			return;
		}

		// DRAW BACKGORUND IF BACKGROUND ENTITY

		if (this.type == 'Background') {

			// DRAW BACKGROUND
			if (typeof this.texture != 'undefined') {

				var image = new Image();
				image.src = this.texture;

				// DRAW TEXTURE
				context.drawImage( 
								  image, 
								  this.x, 
								  this.y 
								 );
			} 
			else {

				// DRAW COLOR
				context.fillStyle = this.color;
				context.fillStyle = 'yellow';
				context.fillRect(
					this.x, 
					this.y,
					context.canvas.width,
					context.canvas.height
				);
			}

			return;
		}


		// CONTINUE FOR DRAWING ANIMATE ENTITY OR STATIC ENTITY

		this.x = (this.body.GetPosition().x * this.SCALE) - this.width/2;
		this.y = (this.body.GetPosition().y * this.SCALE) - this.height/2;
		this.angle = this.body.GetAngle();

		if (
			this.texture
		&&
			(
				this.sx >= this.texture.naturalWidth 
					|| 
						this.previousTexture.src != this.texture.src
		)
		) {
			this.sx = 0;
		}

		context.save();
		// DRAW SHADOW
		context.shadowBlur = 10;
		context.shadowColor = "black";
		context.translate( this.x + (this.width/2), this.y + (this.height/2) );
		context.rotate( this.angle );
		context.translate( -( this.x + (this.width/2) ), -( this.y + (this.height/2) ) );
		// DRAW ENTITY
		if (typeof this.texture != 'undefined') {

			// DRAW TEXTURE
			context.drawImage( 
							  this.texture, 
							  this.sx, 
							  this.sy, 
							  this.width, 
							  this.height, 
							  this.x, 
							  this.y, 
							  this.width, 
							  this.height 
							 );
		} 
		else {
			// DRAW COLOR
			context.fillStyle = this.color;
			context.fillRect(
				this.x, 
				this.y,
				this.width,
				this.height
			);
		}
		context.rotate( -this.angle );
		context.restore();

		var timeDif = new Date().getTime() - this.time;

		if (
			this.texture
		&&
			timeDif >= 400
		) {
			this.sx = this.sx + this.width;
			this.time = new Date().getTime();
		}

		this.previousTexture = this.texture;
	};

	return Entity;
});
