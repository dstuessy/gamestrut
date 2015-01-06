function PlainSword(obj){
	/* general stuff */
	this.width = 66;
	this.height = 18;
	this.x = (obj.x + (obj.width/2));
	this.y = (obj.y + (obj.height/2))+25;
	this.y2 = this.y - obj.height;
	this.x2 = this.x;
	this.y2 = this.y - obj.height;
	
	/* music stuff */
	this.swooshSound = new Audio('game_audio/sound_effects/sword_swoosh.wav');
	this.sound = false;
	
	/* texture stuff */
	this.texture = new Image();
	this.texture.src = 'css/images/spritesheet.png';
	this.sx = 200;
	this.sy = 0;
	this.horizontalTextureCut = 0;
	this.verticalTextureCut = 6;
	this.rotation = -Math.PI/2;
	this.rotationRate = 0.4;
	
	/* stats */
	this.attack = 10;
	
	this.attack = function(obj){/* sword swing animation */
			var rightRotationEnd = 0;
			var leftRotationEnd = 0;
			if(obj.id == 'NPC'){
				rightRotationEnd = -0.1;
				leftRotationEnd = -2.6;
			}
			if(obj.id == 'Player'){
				rightRotationEnd = -0.1;
				leftRotationEnd = -3;
			}
			
			if((obj.lookingRight) && (this.rotation <= rightRotationEnd)){
				this.rotation += this.rotationRate;
				this.x2 = this.width * Math.cos(this.rotation) + this.x;
				this.y2 = this.width * Math.sin(this.rotation) + this.y;
			}
			if((obj.lookingLeft) && (this.rotation >= leftRotationEnd)){
				this.rotation -= this.rotationRate;
				this.x2 = this.width * Math.cos(this.rotation) + this.x;
				this.y2 = this.width * Math.sin(this.rotation) + this.y;
			}
			if(!this.playing && obj.id != 'NPC'){
				this.swooshSound.currentTime = 0;
				this.swooshSound.volume = 0.5;
				this.swooshSound.play();
				this.playing = true;
			}};
			
	this.reset = function(obj){
			if(obj.lookingLeft){
				this.rotation = -Math.PI/2 + 0.2;
			}
			if(obj.lookingRight){
				this.rotation = -Math.PI/2 - 0.2;
			}
			this.x2 = this.width * Math.cos(this.rotation) + this.x;
			this.y2 = this.width * Math.sin(this.rotation) + this.y;
			if(this.playing){
				this.swooshSound.currentTime = 1;
				this.playing = false;
			}};
}
