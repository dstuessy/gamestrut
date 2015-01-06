/* Object holding information on which buttons and mouseclicks are 
 * being pressed or released. 
 * Code obtained here: http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/index.html */

define([], function () {

   var key = {
       pressed: {},
       
       W: 87,
       A: 65,
       S: 83,
       D: 68,
       LEFT: 37,
       RIGHT: 39,
       UP: 38,
       DOWN: 40,
       SPACE: 32,
       SHIFT: 16,
       LCLICK: 1000,
       RCLICK: 1001,
       ESC: 27,
       
       /**Checks to see if a key is pressed
        * If keyCode is 'none' and 'pressed' is empty,
        * then true will be returned.
        */
       isDown: function(keyCode){
           return this.pressed[keyCode];
       },
       
       onKeydown: function(keyCode){
           if(keyCode == 32){
               //alert('space added');
           }
           this.pressed[keyCode] = true;
       },
       
       onKeyup: function(keyCode){
           delete this.pressed[keyCode];
       },
       
       spaceIsdown: function(){
           return this.pressed[32];
       },
       
       onStopJump: function(){
           delete this.pressed[32];
       },
       
       onStopAttack: function(){
           delete this.pressed[1000];
       },
       
       resetAll: function(){
           this.pressed = {};
       }
   };

   return key;
});
