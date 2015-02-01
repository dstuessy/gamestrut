/**
 * Asteroids Game 
 * @version  0.1
 * @author  Daniel Stuessy
 */

define(['jquery', 'game'], function ($, Game) {
   
   var run = function () {
   	   // on DOM ready
      $(function(){
      	  var canvasWidth = 800;
      	  var canvasHeight = 600;
      	  
      	  var game = new Game({
      	  	  canvasID: 'canvas',
      	  	  canvasWidth: canvasWidth,
      	  	  canvasHeight: canvasHeight
		  });
      });
   };

   return run;
});

