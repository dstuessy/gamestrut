
define(['libs/gamestrut/functionalStuff/box2dvariables'], function (box2d) {
   var Level = function (options) {

   	   // CHECK FOR options
   	   if (typeof options == 'undefined') {
   	   	   console.log('options need to be defined in parameters for Level class.');
   	   	   return;
	   }
   	   
   	   // CHECK FOR options.id
   	   if (typeof options.id == 'undefined') {
	   	   console.log('id needs to be defined in Level options');
	   	   return; 
	   }

	   // SET PROPERTIES
	   // SET ID
	   this.id = options.id;
	   // SET TYPE
	   this.type = 'Level';
	   // SET NEXT AND PREVIOUS
   	   this.parents = options.parents || undefined;
   	   this.children = options.children || undefined;
	   // SET GRAVITY
       var gravityH = options.gravityH || 0;
       var gravityV = options.gravityV || 0;
	   // SET SCALE
       var SCALE = options.scale || 40;
       // SET MIN ZINDEX
	   this.minZIndex = 0;


       // SETUP WORLD
       var gravity = new box2d.b2Vec2( gravityH, gravityV);
       this.world = new box2d.b2World(gravity, true);
       
       // SET ENTITIES
       this.entities = options.entities || [];
       // SET LEVEL FOR ENTITIES AND INIT THEIR PHYSICS
	   for (var key in this.entities) {
	   	   var entity = this.entities[key];
	   	   if (typeof entity.level == 'undefined') {
	   	   	   entity.setLevel(this);
		   }
	   }

		// SET UP CONTROLLERS
		for (var controllerIndex in this.controllers) {

			// SET CONTROLLER VALUES
			var controller = this.controllers[controllerIndex];
			var event = controller.event;
			var key = controller.key;
			var preventDefault = controller.preventDefault;
			var execute = controller.execute;
			execute = (typeof execute == 'string' && typeof this[execute] != 'undefined') ? this[execute] : execute;

			// CREATE CONTROLLER
			this.controllers[controllerIndex] = new Controller(key, execute, event, preventDefault);
		}

		// SET UP COLLISIONS
		this.collisions = this.collisions || [];
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

       // LOGIC FUNCTIONS
       this.logic = options.logic || [];

       /*
       // setup debug draw
       var debugDraw = new box2d.b2DebugDraw();
       debugDraw.SetSprite(document.getElementById('debug').getContext('2d'));
       debugDraw.SetDrawScale(SCALE);
       debugDraw.SetFillAlpha(0.5);
       debugDraw.SetFlags(box2d.b2DebugDraw.e_shapeBit | box2d.b2DebugDraw.e_jointBit);
       this.world.SetDebugDraw(debugDraw);
       /**/

       /**
       	* Renders entities on canvas in order
       	* of zindex followed by an indiscriminate
       	* order within zindex.
       	* @return {undefined}
       	*/
       this.draw = function (context) {

		   // GET ZINDEXED ENTITIES
           var zIndexes = this.getEntitiesByZIndex() || [];

		   // FOR EACH ZINDEX IN zIndexes
		   for (var i in zIndexes) {

			   // GET ZINDEX
			   var zindex = zIndexes[i];

			   // FOR EACH ENTITY IN zindex
			   for (var key in zindex) {

				   // GET ENTITY
				   var entity = zindex[key];

				   // DRAW ENTITY
				   entity.draw(context);
			   }
		   }
       };

	   /**
	   	* Returns an object that holds entities, backgrounds, etc
	   	* in their designated zindexes.
	   	*
	   	* The zindexes are held in a hash table 
	   	* where each zindex is a hash as well.
	   	*
	   	* Hash needs to be converted into array
	   	* after the hash is made as the minimum
	   	* zIndex level needs to be set before 
	   	* it can be converted into an array 
	   	* and sorted, of course.
	   	*
	   	* @return {array} Array containing zindexed level entities.
	   	*/
       this.getEntitiesByZIndex = function () {

       	   var self = this;

		   // SET ZINDEX OBJECT 
		   var zIndex = {};

		   // FOR EACH ENTITY
           for (var key in this.entities) {

			   // GET ENTITY
			   var entity = this.entities[key];

			   // ENSURE ZINDEX ENTRY IS AN OBJECT 
			   zIndex[entity.zindex] = (typeof zIndex[entity.zindex] != 'object') ? {} : zIndex[entity.zindex];

			   // SET MIN ZINDEX
			   self.minZIndex = (Number(entity.zindex) < this.minZIndex) ? Number(entity.zindex) : this.minZIndex;
			   
			   // ADD ENTITY TO APPROPRIATE ZINDEX UNDER ITS ID
			   zIndex[entity.zindex][entity.id] = entity;
           }

           //TURN zIndex INTO ARRAY AND SORT IT
		   var array = [];
		   for (var key in zIndex) {

			   // GET zindex OBJECT
		   	   var obj = zIndex[key];
		   	   // SET THE INDEX RELATIVE TO MINIMUM INDEX (min being turned into 0)
		   	   var index = self.minZIndex - Number(key);

			   // ADD zindex object to the array
		   	   array[index] = obj;
		   }

           return array;
	   };

	   /**
	   	* Returns entity under key of "id".
	   	*
	   	* @param {string} id String representing key and id of entity.
	   	* @return {undefined}
	   	*/
       this.getEntity = function(id){
           return this.entities[id];
       };

       /**
       	* Adds entities to the game level
        *
        * @param {Entity} entity An object of entity type.
        * @return {undefined}
        */
       this.addEntity = function(entity){
           this.entities[entity.id] = entity;
       };

       /**
        * Adds a logical function to this level.
        *
        * Will be executed after logic of game.
        * 
        * @param {function} func A JavaScript function of choice.
        * @return {undefined}
        */
       this.addLogic = function(func){
           this.logic.push(func);
       };

       /**
        * Sets the background of the level.
        * @param {object Background} background A Background object
        * @return {undefined}
        */
       this.setBackground = function(background){
           this.background = background;
       };

       /**
        * Sets the gravity of the world in this level
        *  - look at world variable at the top.
        * @param {float} h The magnitude of horizontal gravity.
        * @param {float} v The magnitude of vertical gravity.
        * @return {undefined}
        */
       this.setGravity = function(h,v){
           this.world.gravity = new box2d.b2Vec2(h,v);
       };

       /* SCROLL X */
       this.scrollX = function(){
           var player = level.player,
               scrollspeed = player.body.GetLinearVelocity().x * 40,
               background = level.background,
               staticBlocks = level.staticBlocks,
               decorativeBlocks = level.decorativeBlocks,
               npcs = level.npcs;
           
           if(scrollspeed != 0){
                   background.x -= scrollspeed/10;
           }
           for(var i = 0; i in staticBlocks; i++){
               //staticBlocks[i].body. += scrollspeed;
           }
       };

       /* SCROLL Y */
       this.scrollY = function(){
           var player = level.player,
               scrollspeed = player.body.GetLinearVelocity().y,
               background = level.background,
               staticBlocks = level.staticBlocks,
               decorativeBlocks = level.decorativeBlocks,
               npcs = level.npcs;
           
           if(scrollspeed != 0){
                   background.y -= scrollspeed/10;
           }
           for(var i = 0; i in staticBlocks; i++){
               //staticBlocks[i].body.GetPosition().y += scrollspeed;
           }
       };

       // SET INITIALIZE
       this.initialize = options.initialize || function () {};
       // EXECUTE INITIALIZE IN WRAPPER FOR INITIALIZE for 'this' to be this level.
	   this.initialize();
   };
   
   return Level;
});
