
define([
'libs/game/functionalStuff/box2dvariables',
'libs/game/entities/entityMethods'
], function (box2d, entityMethods) {

   /**
   	* Animate Entity Object 
   	*
   	* Represents an entity in a 'level'.
   	*
   	* @type {object} 
   	*/
   var AnimateEntity = function (properties) {

       /* General Stuff */
       this.id = properties.id;
       this.type = 'AnimateEntity';
       this.x = ( properties.x || 0);
       this.y = ( properties.y || 0);
       this.width = ( properties.width || 0);
       this.height = ( properties.height || 0);
       this.level = properties.level; // non-optional variable

       /* Animation Stuff */
       this.time = new Date().getTime();
       
       /* Texture Stuff */
       this.textures = [];
       this.texture = null;
       this.previousTexture = this.texture;
       this.sx = properties.sx;
       this.sy = properties.sy;
       this.angle = ( properties.angle || 0 );
       this.lookingRight = true;
       this.lookingLeft = false;
       this.color = ( properties.color || 'green' );
       
       /* Physics Stuff */
       this.SCALE = 40;
       var fixDef = new box2d.b2FixtureDef();
       fixDef.density = 1;
       fixDef.restitution = 0;
       fixDef.friction = 0.5;
       var bodyDef = new box2d.b2BodyDef();
       bodyDef.type = box2d.b2Body.b2_dynamicBody;
       bodyDef.position.x = (this.x + (this.width/2)) / this.SCALE;
       bodyDef.position.y = (this.y + (this.height/2)) / this.SCALE;
       bodyDef.angle = this.angle;
       fixDef.shape = new box2d.b2PolygonShape(); // sets type of shape
       fixDef.shape.SetAsBox((this.width / this.SCALE) / 2, (this.height / this.SCALE) / 2); // sets width & height
       this.body = this.level.world.CreateBody(bodyDef);
       this.body.SetUserData(this);
       this.body.CreateFixture(fixDef); // adds the defined body to the defined world.

       /*Essential Functions*/
       this.getPosition = function(){return entityMethods.getPosition(this);};
       this.getAngle = function(){return entityMethods.getAngle(this);};
       this.setPosition = function(x,y){entityMethods.setPosition(this,{x:x,y:y});};
       this.setAngle = function(angle){entityMethods.setAngle(this,angle);};
       this.draw = function(context){entityMethods.draw(this,context);};
       this.addTexture = function(textureID,textureURL){entityMethods.addTexture(this,textureID,textureURL);};
       this.setCurrentTexture = function(textureID){entityMethods.setCurrentTexture(this,textureID);};
       this.addFunction = function(funcName,func){
           this[funcName] = function(){func(this);};
       };

   };

   return AnimateEntity;
});
