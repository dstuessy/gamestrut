
define(['libs/game/functionalStuff/box2dvariables'], function (box2d) {
   var Level = function (properties) {

       var gravityH = (properties && properties.gravityH) ? properties.gravityH : 0;
       var gravityV = (properties && properties.gravityV) ? properties.gravityV : 0;
       
       var SCALE = 40,
           gravity = new box2d.b2Vec2( gravityH, gravityV);
       this.world = new box2d.b2World(gravity, true);
       
       // create background
       this.background = null;
       
       // create entities
       this.entities = [];

       // create decorations
       this.decorations = [];
       
       // logic functions bound to this level
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
       this.draw = function(context){
           if(this.background){
               this.background.draw(context);
           }

           for(var key in this.entities){
               this.entities[key].draw(context);
           }
       };

       this.getEntity = function(entityString){
           return this.entities[entityString];
       };

       /**Adds entities to the game level
        * 'entity' is an object.
        * 'type' is a string indicating whether or not an 'entity' is interactive or decoration.
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
        */
       this.addLogic = function(func){
           this.logic.push(func);
       };

       /**
        * Sets the background of the level.
        * @param {object Background} background A Background object
        */
       this.setBackground = function(background){
           this.background = background;
       };

       /**
        * Sets the gravity of the world in this level
        *  - look at world variable at the top.
        * @param {float} h The magnitude of horizontal gravity.
        * @param {float} v The magnitude of vertical gravity.
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
