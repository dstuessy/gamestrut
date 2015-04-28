gamestrut.js
==============

### Todo list:

* Remove jQuery requirement.
* Level scrolling i.e. scroll level horizontally/vertically when character is at edge of canvas
* &#10004; "z-indexed" entities.
* Make background zoomable.
* Nested entities e.g. TextEntity within an Animate Entity -- useful for menus.
* Have game.mouselisteners that retrieve target game entities under mouse events -- like jquery's event object.
* Maybe entity group?
* Animated background entities.
* Proper implementation of sprite-based animation.
* Clean-up redundant/dead code.
* Fix Entity inheritence from "entityMethods". Turn entityMethods to Entity function. Use call() in all entities to inherit from Entity.


==============
### Requirements
**Currently requires jQuery**

==============
### Source Files

**Production**: in the 'build/' directory.
**Development of GameStrut**: under the 'dev/script/libs/gamestrut' directory.

==============
### What is gamestrut.js

A template-based JavaScript and HTML5 game framework. Core abstractions are provided for structured game development e.g.: Level classes and Entity Classes. 

The main point behind gamestrut.js is to provide JavaScript/HTML5 game developers the core elements of a game so they can structure their code without having to build these at the beginning of every project. These include abstractions in the form of classes: Game, Level, and Entities. These can then be used to produce game content in only a few hours or even minutes. 

On top of that, a physics engine comes included; the one of choice is "boxweb2d". This allows for the developer to save time writing level and game entity classes, and then having to code all the physics and collision logic for their game from scratch. Instead, an entity object already comes with default attributes for physics that can be changed for the perfect feel. 

As for keybinding, the standard JavaScript api for browser keybinds are too jittery and limiting for a decent gaming experience. Instead, the use of a library "Mousetrap.js" is used for 'konami code' features and fluid key response.

I hope this can help as a suitable jump start on game projects.

Happy game developing! 

==============
## Getting Started

To get started, there are three main classes with which to familiarize oneself:

1. Game (REFERENCE to readme section)
2. Level (REFERENCE to readme section)
3. Entities (REFERENCE to readme section)

### Game (REFERENCE to api docs):

This class defines a 'Game' object -- it provides the basic code of a game. This is based on a loop with the stages of: a logic update; clearing of the canvas element; rendering of the game graphics on the canvas element. Moreover, it holds 'Level' objects, and many functions allowing the coding of game logic, and populating its 'Level' objects (REFERENCE to api doc).

**Note**: A 'GameStrut.Game' object starts running the game loop on initialization.

~~~~ javascript
var game = new GameStrut.Game({
	canvasID: 'canvas',
	canvasWidth: 800,
	canvasHeight: 600,
	levels: [level],
	current_level: level,
	disableRightClick: true 
});
~~~~

### Level (REFERENCE to api docs):

This class defines a 'Level' object. It is a datatype that holds entities to populate it:

* AnimateEntity (REFERENCE to readme section)
* TextEntity (REFERENCE to readme section)
* Background (REFERENCE to readme section)

~~~~ javascript
var level = new GameStrut.Level({
	id: "level_test",
	gravityV: 80,
	entities: [player, npc1, npc2, ground, wall]
});
~~~~

### Entities (REFERENCE to api docs):

Entities are objects that populate an instance of the 'Level' class. They come in different types:

* AnimateEntity (REFERENCE to readme section)
* TextEntity (REFERENCE to readme section)
* Background (REFERENCE to readme section)

Each entity class serves a purpose.

#### AnimateEntity (REFERENCE to api docs)

These are entities that are "loose" and interact with physical forces in the game, i.e. they get pulled by gravity -- if it is present -- and pushed around by collisions with other 'animate entities'.

~~~~ javascript 
var player = new GameStrut.AnimateEntity({
	id: 'player',
	x: 50,
	y: 50,
	width: 40,
	height: 80,
	zindex: '1',
	friction: 1,
	density: 1,
	moveVelocity: 12,
	jumpPower: 25,
	// MOVES PLAYER TO THE RIGHT
	moveRight: function () {

		console.log('moveRight!');

		this.setLinearVelocity({x: this.moveVelocity});
		this.setAngularVelocity(0.2);

		if (this.getAngle() > 0.2) {
			this.setAngle(0.2);
		}
	},
	// MOVES PLAYER TO THE LEFT
	moveLeft: function () {

		console.log('moveLeft!');

		this.setLinearVelocity({x: -1*( this.moveVelocity )});
		this.setAngularVelocity(-0.2);

		if (this.getAngle() < -0.2) {
			this.setAngle(-0.2);
		}
	},
	// ADJUSTS PLAYER TO A STANDING POSITION
	standing: function () {

		console.log('standing');

		this.setAngle(0);
		this.setLinearVelocity(0);
		this.setAngularVelocity(0);
	},
	// JUMPS PLAYER
	jump: function () {

		console.log('jump!');

		// DEFINE jumpCount
		this.jumpCount = this.jumpCount || 1;
		// SET jumpPower RELATIVE TO NUMBER OF JUMPS
		var jumpPower = this.jumpPower;

		// ONLY JUMP IF JUMPING IS DONE
		if (
			typeof this.jumped == 'undefined' 
			&& 
			this.jumpCount < 3
		) {

			// APPLY IMPULSE
			this.setLinearVelocity({
				y: -1*( jumpPower )
			});
			// SET JUMPED TO TRUE
			this.jumped = true;
			// INCREASE JUMP COUNT
			this.jumpCount++;
		}
	},
	jumpRelease: function () {
		// DEFINED IN jump FOR THE FIRST TIME
		// used to controll jumps per space press
		this.jumped = undefined;
	},
	jumpReset: function () {
		this.jumpCount = undefined;
	},
	controllers: {
		'jump': {
			event: 'keydown',
			key: 'space',
			preventDefault: true,
			execute: 'jump'
		},
		'jumpRelease': {
			event: 'keyup',
			key: 'space',
			preventDefault: true,
			execute: 'jumpRelease'
		},
		'standing': {
			event: 'keyup',
			key: 'a+d',
			execute: 'standing'
		},
		'right': {
			event: 'keydown',
			key: 'd', 
			execute: 'moveRight'
		},
		'left': {
			event: 'keydown',
			key: 'a',
			execute: 'moveLeft'
		}
	},
	collisions: {
		'BeginContact': {
			'block_test': 'jumpReset',
			'block_test_2': 'jumpReset',
			'block_ceiling': 'jumpReset',
			'block_left_wall': 'jumpReset',
			'block_right_wall': 'jumpReset',
			'animate_entity_test_2': 'jumpReset',
			'animate_entity_test_3': 'jumpReset',
			'block_floor': 'jumpReset'
		}
	}
});
~~~~
#### TextEntity (REFERENCE to api docs)

These are entities that represent text. They do not interact with any object, but serve for things like titles. 

~~~~ javascript
var title = new GameStrut.TextEntity({
	id: 'title',
	text: 'Title!',
	x: canvasWidth/2,
	y: 50,
	fontFamily: 'Helvetica',
	fontColor: '#00ff00',
	zindex: '3'
});
~~~~

#### Background (REFERENCE to api docs)

The 'Background' class creates an object that displays an image in the background of the level; it is the first entity to be rendered on the canvas, and does not interact with anything else.

If a 'Background' object renders an image, it will maintain its "zoom" and aspect ratio, even if it renders out of the canvas edges. It also stays at a fixed position relative to its parent's -- a 'Level' (REFERENCE to api docs) object -- x and y coordinates.

~~~~ javascript
var background = new GameStrut.Background({
	id: 'background',
	//texture: 'images/background.png',
	zindex: '0'
});
~~~~
