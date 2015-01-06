/* This is an object that contains all the methods for anything animate */

define([
'libs/game/functionalStuff/box2dvariables',
'libs/game/functionalStuff/key'
], function (box2d, key) {

   var entityMethods = {
       
       /**
        * Returns the position of the given entity.
        *
        * x and y coordinates are translated into the canvas' scale.
        *
        * x and y coordinates are centered to the entity.
        * 
        * @param  {AnimateEntity} obj An arbitrary Animate Entity that has called this method.
        * @return {object}     An object holding the translated coordinates of the given entity.
        */
       getPosition: function(obj){
           return { x:obj.body.GetPosition().x*obj.SCALE, y:obj.body.GetPosition().y*obj.SCALE };
       },

       /**
        * Returns the angle of the given entity in radians.
        * 
        * @param  {AnimateEntity} obj An arbitrary Aniate Entity that has called this method.
        * @return {float}     The angle in radians of the given entity.
        */
       getAngle: function(obj){
           return obj.body.GetAngle();
       },

       setPosition: function(obj,pos){
           var x = pos.x/obj.SCALE,
               y = pos.y/obj.SCALE;
           obj.body.SetPosition(new box2d.b2Vec2(x,y));
       },

       setAngle: function(obj,angle){
           obj.body.SetAngle(angle);
       },

       /**
        * Adds a texture to the texture array.
        * @param {object AnimateEntity} obj        The animate entity that calls this function.
        * @param {string} textureID  The ID of the texture e.g. 'running'.
        * @param {string} textureURL The URL of the texture e.g. 'images/player.png'.
        */
       addTexture: function(obj,textureID,textureURL){
           var image = new Image();
           image.src = textureURL;
           obj.textures[textureID] = image;
       },

       /**
        * Sets the current texture.
        * @param {object} obj       The animate entity that calls this function.
        * @param {string} textureID The ID of the texture e.g. 'running'.
        */
       setCurrentTexture: function(obj,textureID){
           if(obj.texture){
               obj.texture = obj.textures[textureID];
           }else{
               obj.texture = obj.textures[textureID];
               obj.previousTexture = obj.texture;
           }
       },

       /* painter's algorithm:
        * the sword, shield, and body are drawn in an order
        * depending on the direction the animateEntity is 
        * facing.
        */
       draw: function(obj,context){
           if(!obj.dead){
               if(obj.lookingRight){
                   //this.drawShield(obj,context);
                   this.drawBody(obj,context);
                   //this.drawSword(obj,context);
               }
               if(obj.lookingLeft){
                   //this.drawSword(obj,context);
                   this.drawBody(obj,context);
                   //this.drawShield(obj,context);
               }
           }
       },
       
       drawBody: function(obj,context){
           var temp = $('#about').html();
           $('#about').html(temp + ' <br/>Player: <br/>x: ' + obj.x + ' y: ' + obj.y + ' width: ' + obj.width + ' height: ' + obj.height + ' velocityY: ' + obj.body.GetLinearVelocity().y + '<br/> ' + 'JumpCount: ' + obj['jumpCount'] + ' Key.spaceIsdown(): ' + key.spaceIsdown() + '<br/>');
           
           obj.x = (obj.body.GetPosition().x * obj.SCALE) - obj.width/2;
           obj.y = (obj.body.GetPosition().y * obj.SCALE) - obj.height/2;
           obj.angle = obj.body.GetAngle();
           
           if(
               obj.texture
               &&
               (obj.sx >= obj.texture.naturalWidth || obj.previousTexture.src != obj.texture.src)
           ){
               obj.sx = 0;
           }

           context.save();
            context.shadowBlur = 10;
            context.shadowColor = "black";
            context.translate(obj.x+(obj.width/2),obj.y+(obj.height/2));
            context.rotate(obj.angle);
            context.translate(-(obj.x+(obj.width/2)),-(obj.y+(obj.height/2)));
            if(obj.texture){
               context.drawImage(obj.texture,obj.sx,obj.sy,obj.width,obj.height,obj.x,obj.y,obj.width,obj.height);
            }else{
               context.fillStyle = obj.color;
               context.fillRect(obj.x,obj.y,obj.width,obj.height);
            }
            context.rotate(-obj.angle);
           context.restore();

           var timeDif = new Date().getTime() - obj.time;
           if(
               obj.texture
               &&
               timeDif >= 400
           ){
               obj.sx = obj.sx + obj.width;
               obj.time = new Date().getTime();
           }
           
           obj.previousTexture = obj.texture;
       },
       
       drawShield: function(obj,context){
           if(obj.hasShield){
               var shield = obj.shield;
               context.drawImage(shield.texture,shield.sx,shield.sy,shield.width,shield.height,shield.x,shield.y,shield.width,shield.height);
           }
       },
       
       drawSword: function(obj,context){
           if(obj.hasSword){
               var sword = obj.sword;
               context.save();
               context.translate(sword.x,sword.y);
               context.rotate(sword.rotation);
               context.translate(-sword.x,-sword.y);
               context.drawImage(sword.texture,sword.sx,sword.sy,sword.width,sword.height,sword.x,sword.y-(sword.height/2),sword.width,sword.height);
               context.rotate(-sword.rotation);
               context.restore();
               /* Allows visualisation of the attack line
               context.fillStyle = 'black';
               context.beginPath();
               context.moveTo(sword.x,sword.y);
               context.lineTo(sword.x2,sword.y2);
               context.stroke();
               * */
           }
       }
   };

   return entityMethods;
});
