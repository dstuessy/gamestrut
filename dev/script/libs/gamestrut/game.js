

define([
	'Mousetrap', 
	'libs/gamestrut/functionalStuff/box2dvariables',
	'libs/gamestrut/functionalStuff/key',
	'libs/gamestrut/functionalStuff/controller',
	'libs/gamestrut/entities/level',
	'libs/gamestrut/entities/background',
	'libs/gamestrut/entities/textEntity',
	'libs/gamestrut/entities/entity',
	'libs/gamestrut/entities/animateEntity'
], function (Mousetrap, box2d, key, Controller, Level, Background, TextEntity, Entity, AnimateEntity) {

	var Game = function (options) {

		// CHECK canvasID
		if (typeof options.canvasID == 'undefined') {
			console.log('canvasID needs to be specified in the options');
			return;
		}

		// SET SELF
		var self = this;

		// SET OPTIONS
		this.canvasID = options.canvasID;
		this.canvasWidth = options.canvasWidth || 640;
		this.canvasHeight = options.canvasHeight || 400;

		// SET CANVAS
		this.canvas = document.getElementById( this.canvasID );
		this.context = canvas.getContext('2d');
		// SET CANVAS DIMENSIONS
		this.setCanvasWidth(this.canvasWidth);
		this.setCanvasHeight(this.canvasHeight);

		// SET LEVELS
		this.levels = options.levels || {};
		this.current_level = options.current_level || undefined;
		// SET LOGIC LIST
		this.logics = options.logics || [];

		// SET CONTROLLERS
		this.controllers = options.controllers || [];

		// SET COLLISION LISTENERS
		this.collisions = options.collisions || [];

		// SET STEP VARIABLE
		this.timeStep = options.timeStep || 1/45;

		// SET DEBUG MODE
		this.debugMode = options.debugMode || false;

		// DISABLE RIGHT CLICK ON CANVAS
		var disableRightClick = options.disableRightClick || false;
		if (disableRightClick) {

			// SET EVENT LISTENER FOR ON RIGHT CLICK
			document.oncontextmenu = document.body.oncontextmenu = function (e) {
				
				if ( e.target == self.canvas ) {

					// RETURN FALSE TO DISABLE RIGHT CLICK
					return false;
				}
			};
		}


		// START GAME LOOP
		var intervalId = setInterval(run(),0);

		/* RUN */
		function run(){
			var fps = 45;
			var loops = 0, skipTicks = 1000 / fps,
				maxFrameSkip = 10,
				nextGameTick = (new Date).getTime();
			return function () {
				loops = 0;
				while ( ((new Date).getTime() > nextGameTick) && (loops < maxFrameSkip) ) {
					update();
					nextGameTick += skipTicks;
					loops++;
				}
				if (loops) {
					//level.world.DrawDebugData();
					self.clearCanvas();
					if (self.current_level) {
						self.current_level.draw(self.context);
					}
				}
			};
		}

		/* UPDATE */
		function update(){
			if(self.current_level){
				input();
				logic();
			}
		}

		/* INPUT */
		function input(){

			// EXECUTE GAME CONTROLLERS
			for(var i = 0; i in self.controllers; i++){
				self.controllers[i].run();
			}

			// IF CURRENT LEVEL IS DEFINED
			if (typeof self.current_level != 'undefined') {

				// EXECUTE LEVEL CONTROLLERS
				var levelControllers = self.current_level.controllers;
				for (var i in levelControllers) {

					var controller = levelControllers[i];

					controller.run();
				}

				// EXECUTE ENTITY CONTROLLERS
				for (var i in self.current_level.entities) {

					var entity = self.current_level.entities[i];
					var controllers = entity.controllers;

					for (var o in controllers) {
						controllers[o].run();
					}
				}
			}
		}

		/* LOGIC */
		function logic(){

			for(var i = 0; i in self.logics; i++){
				self.logics[i]();
			}
			for(var i = 0; i in self.current_level.logic; i++){
				self.current_level.logic[i]();
			}

			aiLogic();

			physicsLogic(self.current_level);

			collisionLogic(self.current_level);

			scrollLogic(self.current_level);

			deathLogic();
		}

		/* PHYSICS */
		function physicsLogic(){
			if (self.current_level) {
				self.current_level.world.Step(self.timeStep, 8,3);
				self.current_level.world.ClearForces();
			}
		}

		/* COLLISION LOGIC */
		function collisionLogic(){

			var listener = new Box2D.Dynamics.b2ContactListener;

			// JOIN GAME COLLISIONS WITH LEVEL COLLISIONS
			var collisions = self.collisions.concat( self.current_level.collisions );
			// JOIN ENTITY COLLISIONS WITH GAME AND LEVEL COLLISIONS
			for (var i in self.current_level.entities) {

				var entity = self.current_level.entities[i];

				collisions = collisions.concat( entity.collisions );
			}

			listener.BeginContact = function(contact){

				// GET ENTITY DATA
				var bodyA = contact.GetFixtureA().GetBody();
				var bodyB = contact.GetFixtureB().GetBody();
				var bodyAUserData = bodyA.GetUserData(); // animateEntity
				var bodyBUserData = bodyB.GetUserData(); // animateEntity

				// FOR EACH COLLISION
				for (var i in collisions) {

					var collision = collisions[i];

					collision.run('BeginContact', bodyAUserData, bodyBUserData);
				}
			};
			listener.EndContact = function(contact){

				// GET ENTITY DATA
				var bodyA = contact.GetFixtureA().GetBody();
				var bodyB = contact.GetFixtureB().GetBody();
				var bodyAUserData = bodyA.GetUserData(); // animateEntity
				var bodyBUserData = bodyB.GetUserData(); // animateEntity

				// FOR EACH COLLISION
				for (var i in collisions) {

					var collision = collisions[i];

					collision.run('EndContact', bodyAUserData, bodyBUserData);
				}
			};
			listener.PreSolve = function(contact,oldManifold){

				// GET ENTITY DATA
				var bodyA = contact.GetFixtureA().GetBody();
				var bodyB = contact.GetFixtureB().GetBody();
				var bodyAUserData = bodyA.GetUserData(); // animateEntity
				var bodyBUserData = bodyB.GetUserData(); // animateEntity

				// FOR EACH COLLISION
				for (var i in collisions) {

					var collision = collisions[i];

					collision.run('PreSolve', bodyAUserData, bodyBUserData);
				}
			};
			listener.PostSolve = function(contact, impulse){

				// GET ENTITY DATA
				var bodyA = contact.GetFixtureA().GetBody();
				var bodyB = contact.GetFixtureB().GetBody();
				var bodyAUserData = bodyA.GetUserData(); // animateEntity
				var bodyBUserData = bodyB.GetUserData(); // animateEntity

				// FOR EACH COLLISION
				for (var i in collisions) {

					var collision = collisions[i];

					collision.run('PostSolve', bodyAUserData, bodyBUserData);
				}
			};

			self.current_level.world.SetContactListener(listener);
		}
		/* AI LOGIC */
		function aiLogic(){

		}
		/* SCROLL LOGIC */
		function scrollLogic(){

		}
		/* DEATH LOGIC */
		function deathLogic(){

		}
	};

	Game.prototype.on = function (/*event, target, function*/) {

		for (var i in arguments) {

			var arg = arguments[i];

		}
	};

	/**
	 * Pauses the Game object's physics engine.
	 *
	 * @return {undefined}
	 */
	Game.prototype.pausePhysics = function () {
		this.timeStep = 0;
	};

	/**
	 * Resumes the Game object's physics engine.
	 *
	 * @return {undefined}
	 */
	Game.prototype.resumePhysics = function () {
		this.timeStep = 1/45;
	};

	/**
	 * Clears the canvas by "canvas.width = canvas.width;".
	 * @return {undefined}
	 */ 
	Game.prototype.clearCanvas = function () {
		this.canvas.width = this.canvas.width;
	};

	/**
	 * Gets the width of the canvas.
	 * @return {float} The width of the canvas.
	 */
	Game.prototype.getCanvasWidth = function () {
		return this.canvas.width;
	}
	/**
	 * Gets the height of the canvas.
	 * @return {float} The height of the canvas.
	 */
	Game.prototype.getCanvasHeight = function () {
		return this.canvas.height;
	}

	/**
	 * Obtains and returnes the mouse coordinates
	 * relative to the canvas element.
	 *
	 * @param {Event} event A jQuery Event Object.
	 * @return {Object} An object holding x and y coordinates.
	 */
	Game.prototype.getMousePos = function (event) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: event.clientX - rect.left,
			y: event.clientY - rect.top
		};
	};

	/**
	 * Sets the canvas width.
	 * @param {float} width The width of the canvas.
	 */
	Game.prototype.setCanvasWidth = function (width) {
		this.canvas.width = width;
	};

	/**
	 * Sets the canvas height.
	 * @param {float} height The height of the canvas.
	 */
	Game.prototype.setCanvasHeight = function (height) {
		this.canvas.height = height;
	};

	/**
	 * Adds a Collision Event Listener
	 *
	 * 'objAString' is the 'id' of Object A in the collision
	 * 'objBString' is the 'id' of representing Object B in the collision
	 * 'func' is a function to be executed during a collision with..
	 * ..Object A and Object B.
	 *
	 * First, Object A is obtained using objAString and level.getEntity().
	 * Then the same is done for Object B.
	 * Finally, the two objects are added to an Array that is subsequently..
	 * ..pushed into the 'collisionListener' Array.
	 *
	 * Return: no variable is returned.
	 *
	 * @return {undefined}
	 */
	Game.prototype.addCollisionEventListener = function (contactEvent, objAString, objBString, func) {

		// IF current_level IS DEFINED
		if (typeof this.current_level != 'undefined') {

			// GET OBJECTS
			var objA = this.current_level.getEntity(objAString);
			var objB = this.current_level.getEntity(objBString);

			// GET LISTENER PARAMETERS AND LISTENER FUNCTION
			var listenerFunction = func;
			var listenerParameters = [objAString, objBString];

			// ADD COLLISION LISTENER
			this.collisionListeners.push([contactEvent, listenerFunction, listenerParameters]);
		}
	};

	/**
	 * Adds a Level object to the levels array
	 * @param {object} lvl A Level object.
	 */
	Game.prototype.addLevel = function (lvl) {
		this.levels[lvl.id] = lvl;
	};

	/**
	 * Sets the current level of the game
	 * @param {number} lvlID [description]
	 */
	Game.prototype.setCurrentLevel = function (lvlID) {
		this.current_level = levels[lvlID];
	};

	/**
	 * Adds an if-statement to the input update method
	 * 'key' is a keyCode
	 * 'method' is a string
	 */
	Game.prototype.addController = function (keys, method, isPressed) {
		controllers.push( new Controller(keys, method, isPressed) );
	};

	/**
	 * Adds a given function to the logics array.
	 * This is so users can add custom game logic.
	 *
	 * e.g. an entity shall be respawned on the other side of the screen
	 *  when at the edge of the screen.
	 *  Or when the user feels particularly sadistic, an entity
	 *  shall die at a random moment in time. :P
	 *  
	 * @param {function} func The function that shall be executed.
	 */
	Game.prototype.addLogic = function (func) {
		logics.push(func);
	};

	return Game;
});

