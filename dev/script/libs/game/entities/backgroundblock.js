function backgroundblock(x,y,width,height,color){
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	
	this.setColor = function(c){
		block.color = c;
	};
	
	this.draw = function(){
		var canvas = document.getElementById('canvas');
		var context = canvas.getContext('2d');
		
		context.fillStyle = this.color;
		context.fillRect(this.x,this.y,this.width,this.height);
	}
	
}
