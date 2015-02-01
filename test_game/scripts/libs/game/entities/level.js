
define(['libs/game/functionalStuff/box2dvariables'], function (box2d) {
   var Level = function (properties) {

	   // SETUP WORLD
       var gravityH = (properties && properties.gravityH) ? properties.gravityH : 0;
       var gravityV = (properties && properties.gravityV) ? properties.gravityV : 0;
       var SCALE = 40,
           gravity = new box2d.b2Vec2( gravityH, gravityV);
       this.world = new box2d.b2World(gravity, true);
       
       // SET BACKGROUND
       this.background = null;
       
       // SET ENTITIES
       this.entities = [];

       // SET DECORATIONS
       this.decorations = [];
       
       // LOGIC FUNCTIONS
       this.logic = [];

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
       	* Renders entities on canvas.
       	* @return {undefined}
       	*/
       this.draw = function(context){
           if(this.background){
               this.background.draw(context);
           }

           for(var key in this.entities){
               this.entities[key].draw(context);
           }
       };

	   /**
	   	* Returns entity under key of "entityString"
	   	*
	   	* @param {String} entityString String representing key of entity.
	   	* @return {undefined}
	   	*/
       this.getEntity = function(entityString){
           return this.entities[entityString];
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
   };
   
   return Level;
});
