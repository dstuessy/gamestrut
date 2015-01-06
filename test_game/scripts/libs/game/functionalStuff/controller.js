define(['libs/game/functionalStuff/key'], function (key) {
   /**
    * This object executes a given function when one or more given keys are pressed or released.
    *
    * 'run()' is a function that checks if all keys are pressed or released and then based on 'isPressed',
    *      executes the given function ('this.method').
    * 
    * @param {Array} keys An array holding to the keyCodes in the object 'key'.
    * @param {Function} method A function, passed through as a variable, referencing an entity's function.
    * @param {Boolean} isPressed A boolean variable that indicates if the "this.run()" function shall be executed when the key(s) are released or down. 
    */
   var Controller = function (keys,method,isPressed) {
       this.keys = keys;
       this.isPressed = isPressed;

       this.run = function(){
           var count = 0;
           for(var i = 0; i in this.keys; i++){
               if(key.isDown(this.keys[i])){ count++; }
           }
           if(isPressed){
               if(count == this.keys.length){
                   method();
               }
           }else{
               if(count == 0){method();}
           }
       };
   };

   return Controller;
});
