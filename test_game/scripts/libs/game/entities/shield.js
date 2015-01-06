function PlainShield(obj){
	/* general stuff */
	this.width = 6;
	this.height = 40;
	this.x = obj.x + (obj.width/2);
	this.y = obj.y + (obj.height/2);
	
	/* texture stuff */
	this.texture = new Image();
	this.texture.src = 'css/images/spritesheet.png';
	this.sx = 46;
	this.sy = 40;
	this.sxLeft = 40;
	this.syLeft = 40;
	this.sxRight = 46;
	this.syRight = 40;
	
	/* The Sides */
	this.getTopside = function(){return animateEntity.getTopside(this);};
	this.getBottomside = function(){return animateEntity.getBottomside(this);};
	this.getLeftside = function(){return animateEntity.getLeftside(this);};
	this.getRightside = function(){return animateEntity.getRightside(this);};
}
