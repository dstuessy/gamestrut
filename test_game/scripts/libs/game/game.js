

define([
'Mousetrap', 
'libs/game/functionalStuff/box2dvariables',
'libs/game/functionalStuff/key',
'libs/game/functionalStuff/controller',
'libs/game/entities/level',
'libs/game/entities/background',
'libs/game/entities/textEntity',
'libs/game/entities/entityMethods',
'libs/game/entities/animateEntity'
], function (Mousetrap, box2d, key, Controller, Level, Background, TextEntity, entityMethods, AnimateEntity) {

   /** 
    * GAME DEV API, Version 1.0!
    * @author Daniel Stuessy
    * @description An html5 canvas video game framework.
    *
    * This work of Daniel Stuessy uses the libraries 
    * Mousetrap.js and Box2dWeb.js. 
    * They are used to provide a video game framework 
    * that developers can use to save development time. 
    * 
    * Hopefully this will be of use to someone. :)
    *
    *
    *
    * The MIT License (MIT)
    *
    * Copyright (c) 2014 Daniel Stuessy
    *
    * Permission is hereby granted, free of charge, to any person obtaining a copy
    * of this software and associated documentation files (the "Software"), to deal
    * in the Software without restriction, including without limitation the rights
    * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    * copies of the Software, and to permit persons to whom the Software is
    * furnished to do so, subject to the following conditions:
    *
    * The above copyright notice and this permission notice shall be included in
    * all copies or substantial portions of the Software.
    *
    * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    * THE SOFTWARE.
    */

   window.Game = function (canvasID) {

      var canvas = document.getElementById(canvasID);
      var context = canvas.getContext('2d');

      /* LOCAL STORAGE SETUP */
      if(typeof(Storage) !== "undefined"){
          if(isNaN(localStorage.highscore)){
              localStorage.highscore = 0;
          }
      }
      /* STATE LOADER */
          // Implement Linked List for this
          var levels = [];
          var level = null;
      /* LOGIC FUNCTIONS */
          var logics = [];
      /* CONTROLLERS */
          var controllers = [];
      /* COLLISION LISTENERS */
          var collisionListeners = [];
      /* STEP VARIABLE */
          var timeStep = 1/45;
      /* GAME LOOP */
          var focused = true;
          intervalId = setInterval(run(),0);
      $(window).focus(function(event) {
          focused = true;
      });
      $(window).blur(function(event){
          focused = false;
      });
      if(focused){
      /* INPUT HANDLER */
          // remove default browser keybinds
          $(document).keyup(function(event){
              event.preventDefault();
          });
          $(document).keydown(function(event){
              event.preventDefault();
          });
          $(document).keypress(function(event){
              event.preventDefault();
          });
          $(document).on('contextmenu',function(e){
              if($(e.target).is('canvas')){
                  return false;
              }
          });
          /*$('#debug')[0].oncontextmenu = function(){
              return false;
          };*/
          /* CLICK */
          $(canvas).mousedown(function(event){
              switch(event.which){
                  case 1:
                      key.onKeydown(1000);
                      break;
                  case 2:
                      
                      break;
                  case 3:
                      key.onKeydown(1001);
                      break;
                  default:
                      alert('You have one weird mouse, man!');
              }
          });
          /* UNCLICK */
          $(canvas).mouseup(function(event){
              switch(event.which){
                  case 1:
                      key.onKeyup(1000);
                      break;
                  case 2:
                      // nothing for this button yet
                      break;
                  case 3:
                      key.onKeyup(1001);
                      break;
                  default:
                      alert('You have one weird mouse, man!');
              }
          });

          /* LEFT */
          Mousetrap.bind('left',function(){key.onKeydown(key.LEFT);},'keydown');
          Mousetrap.bind('left',function(){key.onKeyup(key.LEFT);},'keyup');
          /* RIGHT */
          Mousetrap.bind('right',function(){key.onKeydown(key.RIGHT);},'keydown');
          Mousetrap.bind('right',function(){key.onKeyup(key.RIGHT);},'keyup');
          /* SPACE */
          Mousetrap.bind('space',function(){key.onKeydown(key.SPACE);},'keydown');
          Mousetrap.bind('space',function(){key.onKeyup(key.SPACE);},'keyup');
          /* SHIFT */
          Mousetrap.bind('shift',function(){key.onKeydown(key.SHIFT);},'keydown');
          Mousetrap.bind('shift',function(){key.onKeyup(key.SHIFT);},'keyup');
          /* A */
          Mousetrap.bind('a',function(){key.onKeydown(key.A);},'keydown');
          Mousetrap.bind('a',function(){key.onKeyup(key.A);},'keyup');
          /* D */
          Mousetrap.bind('d',function(){key.onKeydown(key.D);},'keydown');
          Mousetrap.bind('d',function(){key.onKeyup(key.D);},'keyup');
          /* ESC */
          Mousetrap.bind('esc',function(){key.onKeydown(key.ESC);},'keydown');
          Mousetrap.bind('esc',function(){key.onKeyUp(key.ESC);},'keyup');
          /* No Key Pressed */
          Mousetrap.bind('none',function(){key.onKeydown(key.NONE);},'keydown');
          Mousetrap.bind('none',function(){key.onKeyUp(key.NONE);},'keyup');
      }
      var self = this;
      /* RUN */
      function run(){
          var fps = 45;
          var loops = 0, skipTicks = 1000 / fps,
          maxFrameSkip = 10,
          nextGameTick = (new Date).getTime();
          return function(){
              loops = 0;
              while(focused && ((new Date).getTime() > nextGameTick) && (loops < maxFrameSkip)){
                  self.clearConsoleGameText();
                  //print2(['Canvas Width: ',canvas.width,'px']);
                  update();
                  nextGameTick += skipTicks;
                  loops++;
              }
              if(loops){
                  //level.world.DrawDebugData();
                  self.clearCanvas();
                  if(level){
                      level.draw(context);
                  }
              }
          };
      }


      /* UPDATE */
      function update(){
          if(level){
              input();
              logic();
              //console.log(level);
          }
      }

      /* INPUT */
      function input(){
          for(var i = 0; i in controllers; i++){
              controllers[i].run();
          }
      }

      /* LOGIC */
      function logic(){

          for(var i = 0; i in logics; i++){
              logics[i]();
          }
          for(var i = 0; i in level.logic; i++){
              level.logic[i]();
          }

          aiLogic();
          
          physicsLogic(level);
          
          collisionLogic(level);
          
          scrollLogic(level);
          
          deathLogic();
      }

              /* PHYSICS */
              function physicsLogic(){
                  $('#about').html('running');
                  if(level){
                      //console.log(level);
                      level.world.Step(timeStep, 8,3);
                      level.world.ClearForces();
                  }
              }
              /* COLLISION LOGIC */
              function collisionLogic(){
                  var listener = new Box2D.Dynamics.b2ContactListener;

                  listener.BeginContact = function(contact){
                      var bodyA = contact.GetFixtureA().GetBody(),
                          bodyB = contact.GetFixtureB().GetBody(),
                          bodyAUserData = bodyA.GetUserData(), // objects used to pass into collision function
                          bodyBUserData = bodyB.GetUserData(); // objects used to pass into collision function
                     
                      if(bodyAUserData && bodyBUserData){
                          //print2(['Collisions!']);

                          for(var i = 0; i in collisionListeners; i++){
                              var contactEvent = collisionListeners[i][0];
                              if(contactEvent == 'BeginContact'){
                                  var func = collisionListeners[i][1];
                                  var bodyIDs = collisionListeners[i][2],
                                      bodyAID = bodyIDs[0],
                                      bodyBID = bodyIDs[1];
                                      
                                  if(bodyAUserData.id.indexOf(bodyAID) > -1  && bodyBUserData.id.indexOf(bodyBID) > -1){
                                      func(bodyAUserData,bodyBUserData);
                                  }
                              }
                          }
                      }
                  }
                  listener.EndContact = function(contact){
                      var bodyA = contact.GetFixtureA().GetBody(),
                          bodyB = contact.GetFixtureB().GetBody(),
                          bodyAUserData = bodyA.GetUserData(), // objects used to pass into collision function
                          bodyBUserData = bodyB.GetUserData(); // objects used to pass into collision function
                     
                      if(bodyAUserData && bodyBUserData){
                          //print2(['Collisions!']);

                          for(var i = 0; i in collisionListeners; i++){
                              var contactEvent = collisionListeners[i][0];
                              if(contactEvent == 'EndContact'){
                                  var func = collisionListeners[i][1];
                                  var bodyIDs = collisionListeners[i][2],
                                      bodyAID = bodyIDs[0],
                                      bodyBID = bodyIDs[1];

                                  if(bodyAUserData.id == bodyAID && bodyBUserData.id == bodyBID){
                                      func(bodyAUserData,bodyBUserData);
                                  }
                              }
                          }
                      }
                  }

                  listener.PreSolve = function(contact,oldManifold){
                      var bodyA = contact.GetFixtureA().GetBody(),
                          bodyB = contact.GetFixtureB().GetBody(),
                          bodyAUserData = bodyA.GetUserData(), // objects used to pass into collision function
                          bodyBUserData = bodyB.GetUserData(); // objects used to pass into collision function
                     
                      if(bodyAUserData && bodyBUserData){
                          //print2(['Collisions!']);

                          for(var i = 0; i in collisionListeners; i++){
                              var contactEvent = collisionListeners[i][0];
                              if(contactEvent == 'PreSolve'){
                                  var func = collisionListeners[i][1];
                                  var bodyIDs = collisionListeners[i][2],
                                      bodyAID = bodyIDs[0],
                                      bodyBID = bodyIDs[1];

                                  if(bodyAUserData.id == bodyAID && bodyBUserData.id == bodyBID){
                                      func(bodyAUserData,bodyBUserData);
                                  }
                              }
                          }
                      }
                  }
                  listener.PostSolve = function(contact,impulse){
                      var bodyA = contact.GetFixtureA().GetBody(),
                          bodyB = contact.GetFixtureB().GetBody(),
                          bodyAUserData = bodyA.GetUserData(), // objects used to pass into collision function
                          bodyBUserData = bodyB.GetUserData(); // objects used to pass into collision function
                     
                      if(bodyAUserData && bodyBUserData){
                          //print2(['Collisions!']);

                          for(var i = 0; i in collisionListeners; i++){
                              var contactEvent = collisionListeners[i][0];
                              if(contactEvent == 'PostSolve'){
                                  var func = collisionListeners[i][1];
                                  var bodyIDs = collisionListeners[i][2],
                                      bodyAID = bodyIDs[0],
                                      bodyBID = bodyIDs[1];

                                  if(bodyAUserData.id == bodyAID && bodyBUserData.id == bodyBID){
                                      func(bodyAUserData,bodyBUserData);
                                  }
                              }
                          }
                      }
                  }
                  level.world.SetContactListener(listener);
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

      /**Clears the canvas by "canvas.width = canvas.width;".
       */
      this.clearCanvas = function(){
          canvas.width = canvas.width;
      };
      /**
       * Sets the canvas width.
       * @param {float} width The width of the canvas.
       */
      this.setCanvasWidth = function(width){
          canvas.width = width;
      };

      /**
       * Sets the canvas height.
       * @param {float} height The height of the canvas.
       */
      this.setCanvasHeight = function(height){
          canvas.height = height;
      }

      /**
       * Gets the width of the canvas.
       * @return {float} The width of the canvas.
       */
      this.getCanvasWidth = function(){
          return canvas.width;
      }
      /**
       * Gets the height of the canvas.
       * @return {float} The height of the canvas.
       */
      this.getCanvasHeight = function(){
          return canvas.height;
      }

      /**Clears #consoleGameText by ".html('');".
       */
      this.clearConsoleGameText = function(){
          $('#consoleGameText').html('');
      };

      /* GET MOUSE POS */
      this.getMousePos = function(event){
          var rect = canvas.getBoundingClientRect();
          return {
              x: event.clientX - rect.left,
              y: event.clientY - rect.top
          };
      };


      this.pausePhysics = function(){
          timeStep = 0;
      };
      this.resumePhysics = function(){
          timeStep = 1/45;
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
      this.addLogic = function(func){
          logics.push(func);
      };

      /**Adds an if-statement to the input update method
       * 'key' is a keyCode
       * 'method' is a string
       */
      this.addController = function(keys,method,isPressed){
          controllers.push(new Controller(keys,method,isPressed));
      };

      /**
       * Sets the current level of the game
       * @param {[type]} lvlID [description]
       */
      this.setCurrentLevel = function(lvlID){
          level = levels[lvlID];
      };
      /**
       * Adds a Level object to the levels array
       * @param {object} lvl A Level object.
       */
      this.addLevel = function(lvl,lvlID){
          levels[lvlID] = lvl;
          //console.log(levels);
      };
      /**Retrieves the current level
       */
      this.getLevel = function(){
          return level;
      };

      /**Adds a Collision Event Listener
          'objAString' is a String representing Object A in the collision
          'objBString' is a String representing Object B in the collision
          'func' is a function to be executed during a collision with..
          ..Object A and Object B.
         
         First, Object A is obtained using objAString and level.getEntity().
         Then the same is done for Object B.
         Finally, the two objects are added to an Array that is subsequently..
         ..pushed into the 'collisionListener' Array.

         Return: no variable is returned.

      */
      this.addCollisionEventListener = function(contactEvent, objAString, objBString, func){
          if(level){
              var objA = this.getLevel().getEntity(objAString),
                  objB = this.getLevel().getEntity(objBString);
              var listenerFunction = func,
                  listenerParameters = [objAString,objBString];
              collisionListeners.push([contactEvent,listenerFunction,listenerParameters]);
          }
      };
      
      /**
       * Creates and returns a new Level Object.
       * 
       * @param {Object} properties A JSON object that holds properties for the new Level object.
       * @return {Level} A new Level Object.
       */
      this.newLevel = function (properties) {
          return new Level(properties);
      };

      /**
       * Creates and returns a new Background Object.
       * 
       * @param {Object} properties A JSON object that holds properties for the new Background object.
       * @return {Backgroud} A new Background Object.
       */
      this.newBackground = function (imageString) {
          return new Background(imageString);
      };

      /**
       * Creates and returns a new TextEntity Object.
       * 
       * @param {Object} properties A JSON object that holds properties for the new TextEntity object.
       * @return {TextEntity} A new TextEntity Object.
       */
      this.newTextEntity = function (text, properties) {
          return new TextEntity(text, properties);
      };

      /**
       * Creates and returns the entityMethods hash table.
       * 
       * @return {entityMethods} A entityMethods entityMethods hash table.
       */
      this.entityMethods = function () {
          return entityMethods;
      };

      /**
       * Creates and returns a new AnimateEntity Object.
       * 
       * @param {Object} properties A JSON object that holds properties for the new AnimateEntity object.
       * @return {AnimateEntity} A new AnimateEntity Object.
       */
      this.newAnimateEntity = function (properties) {
          return new AnimateEntity(properties);
      };

      /**
       * Creates and returns key Object.
       * 
       * @return {key} The key Object.
       */
      this.key = function () {
          return key;
      };

      /**
       * Returns box2d object.
       *
       * @return {box2d} The box2d object.
       */
      this.box2d = function () {
         return box2d;
      };
   };

   return Game;
});

