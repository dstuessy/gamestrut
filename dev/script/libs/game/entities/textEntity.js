
define([], function () {

      var TextEntity = function (text,properties){
              this.id = properties.id;
          this.type = 'Text';
              this.text = text;
              this.x = ( properties.x || 0 );
              this.y = ( properties.y || 0 );
              this.fontSize = ( properties.fontSize || 20 );
              this.fontColor = ( properties.fontColor || 'black' );
              this.fontFamily = ( properties.fontFamily || 'Arial' );
      }
      
      TextEntity.prototype.draw = function(ctx){
              ctx.font = this.fontSize + 'px ' + this.fontFamily;
              ctx.fillStyle = this.fontColor;
              ctx.fillText(this.text,this.x,this.y);
      };
     
      return TextEntity;
});
