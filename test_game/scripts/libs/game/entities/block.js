// object that allows static entities in the level..
// ..e.g. walls and floors. ////////////////////////////////////////////

function Block(
id,
x,
y,
width,
height,
sx,
sy,
world
){
    this.id = id;
    this.type = 'Block';
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //this.context = document.getElementById('canvas').getContext('2d');
        
    /* Texture Stuff */
    this.textures = [];
    this.texture = null;
    this.previousTexture = this.texture;
    this.sx = sx, this.sy = sy, this.sWidth = width, this.sHeight = height;
    
    // Physics based info
    this.SCALE = 40;
    var fixDef = new box2d.b2FixtureDef();
    fixDef.density = 1;
    fixDef.friction = 0.5;
    var bodyDef = new box2d.b2BodyDef();
    bodyDef.type = box2d.b2Body.b2_staticBody;
    bodyDef.position.x = (this.x + (this.width/2)) / this.SCALE;
    bodyDef.position.y = (this.y + (this.height/2)) / this.SCALE;
    fixDef.shape = new box2d.b2PolygonShape(); // sets type of shape
    fixDef.shape.SetAsBox((this.width / this.SCALE) / 2, (this.height / this.SCALE) / 2); // sets width & height
    this.body = world.CreateBody(bodyDef);
    this.body.SetUserData(this);
    this.body.CreateFixture(fixDef); // adds the defined body to the defined world.
    
    /**
     * Sets the texture.
     * @param {string} textureURL The URL of the texture e.g. 'images/dirt.png'.
     */
    this.setTexture = function(textureURL){
        this.texture = new Image();
        this.texture.src = textureURL;
    },

    /* Drawing Function */
    this.draw = function(context){
        this.x  = (this.body.GetPosition().x * this.SCALE) - this.width/2;
        this.y = (this.body.GetPosition().y * this.SCALE) - this.height/2;
        this.rotation = this.body.GetAngle() * (180 / Math.PI);
        if(this.texture){
            context.save();
             context.shadowBlur = 10;
             context.shadowColor = "black";
             context.fillRect(this.x,this.y,this.width,this.height);
            context.restore();
            context.save();
             context.rotate(this.rotation);
             for(var i = 0; i < this.width/40; i++){
                for(var o = 0; o < this.height/40; o++){
                    context.drawImage(this.texture,this.sx,this.sy,this.sWidth,this.sHeight,this.x+(i*40),this.y+(o*40),40,40);
                }
             }
            context.restore();
        }
    }
    
}
