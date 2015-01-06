/**
 * Asteroids Game 
 * @version  0.1
 * @author  Daniel Stuessy
 */

define(['jquery', 'game'], function ($, Game) {
   
   var run = function () {
      $(document).ready(function(){
              var canvasWidth = 800,
                  canvasHeight = 600;
              var game = new Game('canvas');
                  game.setCanvasWidth(canvasWidth);
                  game.setCanvasHeight(canvasHeight);
                  
              var box2d = game.box2d();
              var key = game.key();



              var level = game.newLevel({
                              gravityH:0, //optional
                              gravityV:0 // optional
                      });	
                  world = level.world;

              // Add Background
              var background = game.newBackground('images/background.png');
              level.setBackground(background);

              // DECLARE ENTITIES
              var title = game.newTextEntity('Asteroids', {
                      id:'title',
                      x:(canvasWidth/2)-(55),
                      y:25,
                      fontFamily:'Orbitron',
                      fontColor:'#00ff00'
              });
              var player = game.newAnimateEntity({
                              id:'Player',
                              x:(canvasWidth/2)-20,
                              y:(canvasHeight/2)-20,
                              width:40,
                              height:40,
                              sx:0,
                              sy:0,
                              angle:0,
                              world:world
                      });
              player.addTexture('default','images/player.png');
              player.setCurrentTexture('default');
              
              // ENTITY METHODS
              // MOVE
              game.entityMethods['move'] = function(obj){
                      obj.body.SetAwake(true);

                      var angle = obj.body.GetAngle();
                      var vector = obj.body.GetWorldVector(new box2d.b2Vec2(0,-5));//new box2d.b2Vec2(0, -1);
                      var pos = obj.body.GetPosition();
                      //obj.body.ApplyForce(vector,player.body.GetPosition());//vector,player.body.GetWorldCenter());

                      var velocity = obj.body.GetLinearVelocity();
                      if(velocity.x < 10 && velocity.y < 10){
                              obj.body.ApplyForce(vector,pos);
                      }
              };
              // SHOOT
              var mouseIsDown = false;
              var previousTime = (new Date()).getTime();
              var bulletNo = 0;
              game.entityMethods['shoot'] = function(obj){
                      var currentTime = (new Date()).getTime();
                      if(currentTime - previousTime  > 100){
                              previousTime = currentTime;

                              var position = player.body.GetPosition();
                              var x = position.x*player.SCALE;
                              var y = position.y*player.SCALE;
                              var angle = player.body.GetAngle();
                              var x2 = x-(player.height) * Math.cos((Math.PI/2)+angle);
                              var y2 = y-(player.height) * Math.sin((Math.PI/2)+angle);



                              var bullet = game.newAnimateEntity({
                                      id:'Bullet '+bulletNo,
                                      x:x2,
                                      y:y2,
                                      width:3,
                                      height:3,
                                      sx:0,
                                      sy:0,
                                      angle:angle,
                                      world:world
                              });
                              bullet.addTexture('default','images/bullet.png');
                              bullet.setCurrentTexture('default');

                              bullet.addFunction('propell', game.entityMethods['propell']);

                              level.addEntity(bullet,'interactive');

                                              bullet['propell']();
                              bulletNo++;
                              if(bulletNo > 20){
                                      bulletNo = 0;
                              }
                      }
              };
              // STATIONARY
              game.entityMethods['stationary'] = function(obj){
                      obj.body.SetAwake(true);
                      var velocity = obj.body.GetLinearVelocity();
                      var accelX = 0.2,
                              accelY = 0.2;
                      if(velocity.x >= accelX){
                              velocity.x -= accelX;
                      }
                      if(velocity.y >= accelY){
                              velocity.y -= accelY;
                      }
                      if(velocity.x < 0.5 && velocity.x > -0.5){
                              velocity.x = 0;
                      }
              }
              // PROPELL
              game.entityMethods['propell'] = function(obj){
                      obj.body.SetAwake(true);

                      var angle = obj.body.GetAngle();
                      var vector = obj.body.GetWorldVector(new box2d.b2Vec2(0,-2));//new box2d.b2Vec2(0, -1);
                      var pos = obj.body.GetPosition();
                      obj.body.ApplyForce(vector,pos);//vector,player.body.GetWorldCenter());

                      var velocity = obj.body.GetLinearVelocity();
                      if(velocity.x >= 10){
                              velocity.x = 10;
                      }
                      if(velocity.y >= 10){
                              velocity.y = 10;
                      }
              }
              // APPLY PLAYER FUNCTIONS
              player.addFunction('move', game.entityMethods['move']);
              player.addFunction('shoot', game.entityMethods['shoot']);
              player.addFunction('stationary', game.entityMethods['stationary']);

              // ADD ENTITIES TO LEVEL
              level.addEntity(title);
              level.addEntity(player);

              // ADD LEVEL TO GAME
              game.addLevel(level,'first');
              game.setCurrentLevel('first');

              // COLLISION EVENT LISTENERS
              game.addCollisionEventListener('BeginContact','Bullet','Player',function(entityA,entityB){

                      if(entityB.id.indexOf('Bullet') > -1){
                              delete level.entities[entityB.id];
                      }
                      if(entityA.id.indexOf('Bullet') > -1){
                              delete level.entities[entityA.id];
                      }
              });
              game.addCollisionEventListener('BeginContact','Player','Bullet',function(entityA,entityB){

                      if(entityB.id.indexOf('Bullet') > -1){
                              delete level.entities[entityB.id];
                      }
                      if(entityA.id.indexOf('Bullet') > -1){
                              delete level.entities[entityA.id];
                      }
              });
              game.addCollisionEventListener('BeginContact','Bullet','Asteroid',function(entityA,entityB){

                      if(entityB.id.indexOf('Bullet') > -1){
                              delete level.entities[entityB.id];
                      }
                      if(entityA.id.indexOf('Bullet') > -1){
                              delete level.entities[entityA.id];
                      }
              });

              // PLAYER BORDER LOGIC
              game.addLogic(function(){
                      // MAKE POSITIONS WORK WITH PLAYER.SETPOSITION() OR PLAYER.GETPOSITION().
                      // BOX2D NEEDS TO BE IN THE BACKEND WHILST STILL ACCESSIBLE TO THE USER.
                      for(var key in level.entities){
                              var entity = level.entities[key];

                              if(entity.type == 'AnimateEntity'){
                                      var position = entity.body.GetPosition();
                                      var angle = entity.body.GetAngle();

                                      if( (position.x * entity.SCALE) - (entity.width / 2) > canvasWidth ){
                                              position = new box2d.b2Vec2( 0 - ((entity.width/2) /entity.SCALE ), position.y );
                                      }
                                      else if( (position.y * entity.SCALE) - (entity.height / 2) > canvasHeight ){
                                              position = new box2d.b2Vec2( position.x, 0  - ((entity.height/2) / entity.SCALE) );
                                      }
                                      else if( (position.x * entity.SCALE) + (entity.width / 2) < 0 ){
                                              position = new box2d.b2Vec2( (canvasWidth + (entity.width/2)) / entity.SCALE, position.y );
                                      }
                                      else if( (position.y * entity.SCALE) + (entity.height / 2) < 0 ){
                                              position = new box2d.b2Vec2( position.x, (canvasHeight + (entity.height/2)) / entity.SCALE);
                                      }
                                      
                                      entity.body.SetPositionAndAngle(position,angle);
                              }
                      }
              });
              // ASTEROID SPAWN AND MOVEMENT LOGIC
              level.addLogic(function(){
                      var asteroidCount = 0;

                      for(var key in level.entities){
                              var entity = level.entities[key];

                              if(entity.id.indexOf('Asteroid') > -1){
                                      asteroidCount++;
                              }
                      }

                      if(asteroidCount <= 0){
                              for(var i = 0; i < 5; i++){
                                      var xSpace = Math.floor( Math.random() * (level.entities['Player'].x - 200)  + 1 );
                                      var ySpace = Math.floor( Math.random() * (level.entities['Player'].y + 200)  + 1 );
                                      var randomX = Math.round( Math.random() );
                                      var randomY = Math.round( Math.random() );

                                      var x = (randomX == 1) ? xSpace : canvasWidth - xSpace - 75;
                                      var y = (randomY == 1) ? ySpace : canvasHeight - ySpace - 75;

                                      var asteroid = game.newAnimateEntity({
                                              id: 'Asteroid '+i,
                                              x: x,
                                              y: y,
                                              width: 75,
                                              height: 75,
                                              angle: Math.random() * Math.PI,
                                              world: world
                                      });
                                      level.addEntity(asteroid);

                                      asteroid.body.SetAwake(true);

                                      var vector = asteroid.body.GetWorldVector(new box2d.b2Vec2(0,150));
                                      var pos = asteroid.body.GetPosition();

                                      asteroid.body.ApplyForce(vector,pos);
                              }
                      }
              });
              // PLAYER ORIENTATION MOUSE LOGIC
              var mouseX, mouseY;
              level.addLogic(function(){
                      if(mouseX && mouseY){
                              //Reset Angular Physics
                              player.body.SetAngularVelocity(0);

                              var deltaY = mouseY - (player.body.GetPosition().y*player.SCALE);
                              var deltaX = mouseX - (player.body.GetPosition().x*player.SCALE);

                              var angle = Math.atan( deltaY / deltaX );
                              if(mouseX < player.body.GetPosition().x*player.SCALE){
                                      angle-=Math.PI;
                              }

                              var playerPosition = player.body.GetPosition();
                              player.body.SetPositionAndAngle(playerPosition,(Math.PI/2)+angle);
                      }
              });

              // SET CONTROLLERS FOR ENTITIES
              game.addController( [key.SPACE], function(){
                      player['move']();
              },true);
              game.addController( [key.LCLICK], function(){
                      player['shoot']();
              },true);
              // MOUSE MOVE LISTENER
              $(document).on('mousemove','#canvas',function(e){
                      var mousePos = game.getMousePos(e);
                      mouseX = mousePos.x;
                      mouseY = mousePos.y;
              });
      });
   };

   return run;
});

