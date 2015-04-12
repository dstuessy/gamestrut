/* This is an object that contains all the methods for anything animate */

define([
	'libs/game/functionalStuff/box2dvariables',
	'libs/game/functionalStuff/key',
	'libs/game/functionalStuff/collision',
	'libs/game/functionalStuff/controller'
], function (box2d, key, Collision, Controller) {

	var entityMethods = {


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
		set: function (key, attribute) {

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
		},

		/**
		 * Returns the position of the given entity.
		 *
		 * x and y coordinates are translated into the canvas' scale.
		 *
		 * x and y coordinates are centered to the entity.
		 * 
		 * @return {object}     An object holding the translated coordinates of the given entity.
		 */
		getPosition: function () {

			// GET POSITION FROM BOX2D BODY 
			var x = this.body.GetPosition().x * this.SCALE;
			var y = this.body.GetPosition().y * this.SCALE;

			// RETURN POSITION
			return { x:x, y:y };
		},

		/**
		 * Returns the angle of the given entity in radians.
		 * 
		 * @return {float}     The angle in radians of the given entity.
		 */
		getAngle: function () {
			return this.body.GetAngle();
		},

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
		setPosition: function (pos) {

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
		},

		/**
		 * Sets angle of object's box2d boxy.
		 *
		 * @param {number} angle Number representing degrees in Radian.
		 * @return {undefined}
		 */
		setAngle: function (angle) {

			// WAKE UP BODY
			this.body.SetAwake(true);
			// RESET ANGULAR PHYSICS
			this.body.SetAngularVelocity(0);
			// SET ANGLE
			this.body.SetAngle(angle);
		},

		/**
		 * Sets the angular velocity of 
		 * the object's box2d body.
		 *
		 * @param {number} angle Number representing degrees in Radian.
		 * @return {undefined}
		 */
		setAngularVelocity: function (angle) {

			// WAKE UP BODY
			this.body.SetAwake(true);
			// SET ANGULAR VELOCITY
			this.body.SetAngularVelocity(angle);
		},

		/**
		 * Sets linear velocity of object's box2d body.
		 *
		 * @param {object} vals Object holding x and y values.
		 * @return {undefined}
		 */
		setLinearVelocity: function (vals) {

			// WAKE UP BODY
			this.body.SetAwake(true);

			// SET LINEAR VELOCITY 
			this.body.GetLinearVelocity().x = vals.x || this.body.GetLinearVelocity().x;
			this.body.GetLinearVelocity().y = vals.y || this.body.GetLinearVelocity().y;
		},

		/**
		 * Adds a texture to the texture array.
		 *
		 * @param {string} textureID  The ID of the texture e.g. 'running'.
		 * @param {string} textureURL The URL of the texture e.g. 'images/player.png'.
		 */
		addTexture: function (textureID,textureURL) {

			var image = new Image();
			image.src = textureURL;

			this.textures[textureID] = image;
		},

		/**
		 * Sets the current texture.
		 *
		 * @param {string} textureID The ID of the texture e.g. 'running'.
		 */
		setTexture: function (textureID) {

			if (typeof this.texture != 'undefined') {

				this.texture = this.textures[textureID];
			} else {

				this.texture = this.textures[textureID];
				this.previousTexture = this.texture;
			}
		},

		setLevel: function (level) {

			// ADD LEVEL IF IT'S DEFINED AND OF TYPE 'level'
			if (typeof level != 'undefined' && level.type == 'Level') {
				this.level = level;
				this.initPhysics();
			}
			else {
				// ERROR OUTPUT
				console.log(level);
				console.log('could not set above ' + level + ' as level.');
			}
		},

		initControllers: function () {
			
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
		},

		/**
		 * Initializes all collision listeners for the animate entity.
		 *
		 * @return {undefined}
		 */
		initCollisions: function () {

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
		},

		/* painter's algorithm:
		 * the sword, shield, and body are drawn in an order
		 * depending on the direction the animateEntity is 
		 * facing.
		 */
		draw: function (context) {

			// DRAW FOR ANIMATE ENTITY
			if (this.type = 'AnimateEntity' && !this.dead) {

				if (this.lookingRight) {

					//this.drawShield(context);
					this.drawBody(context);
					//this.drawSword(context);
				}

				if (this.lookingLeft) {

					//this.drawSword(context);
					this.drawBody(context);
					//this.drawShield(context);
				}
			}

			// DRAW FOR BLOCK
			if (this.type = 'Block') {
				this.drawBody(context);
			}
		},

		drawBody: function (context) {

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
		},

		drawShield: function (context) {

			if(this.hasShield){

				var shield = this.shield;

				context.drawImage(
					shield.texture,
					shield.sx,
					shield.sy,
					shield.width,
					shield.height,
					shield.x,
					shield.y,
					shield.width,
					shield.height
				);
			}
		},

		drawSword: function (context) {

			if (this.hasSword) {

				var sword = this.sword;

				context.save();
				context.translate( sword.x, sword.y );
				context.rotate( sword.rotation );
				context.translate( -sword.x, -sword.y );
				context.drawImage( 
								  sword.texture,
								  sword.sx,
								  sword.sy,
								  sword.width,
								  sword.height,
								  sword.x,
								  sword.y - (sword.height/2),
								  sword.width,
								  sword.height
								 );
								 context.rotate( -sword.rotation );
								 context.restore();
								 /* 
								 // Allows visualisation of the attack line
								 context.fillStyle = 'black';
								 context.beginPath();
								 context.moveTo( sword.x, sword.y );
								 context.lineTo( sword.x2, sword.y2 );
								 context.stroke();
								 */
			}
		}
	};

	return entityMethods;
});
