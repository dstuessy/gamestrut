
define([], function () {
   var Background = function (imageString) {
        
        //this.context = document.getElementById('canvas').getContext('2d');
        this.texture = new Image();
        this.texture.src = imageString;
        this.x = 0;
        this.y = 0;
        this.width = this.texture.width;
        this.height = this.texture.height;
        
        this.draw = function(context){
                context.drawImage(this.texture,this.x,this.y);
        };
        
        this.getX = function(){
                return this.getX();
        };
        
        this.setX = function(tempX){
                this.x = tempX;
        };
   };

   return Background;
});
