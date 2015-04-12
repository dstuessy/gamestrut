gamestrut.js
==============

### Todo list:

* &#10004; Redesign objects similar to Backbone.js -- better structure and more simple.
* Instead of "world" option for AnimateEntity, make it "level".
* Level scrolling i.e. scroll level horizontally/vertically when character is at edge of canvas
* "z-indexed" background entities.
* Make background zoomable.
* Nested entities e.g. TextEntity within an Animate Entity -- useful for menus.
* Have game.mouselisteners that retrieve target game entities under mouse events -- like jquery's event object.
* Maybe entity group?
* Animated background entities.
* Proper implementation of sprite-based animation.
* Clean-up redundant/dead code.

==============
### What is gamestrut.js

A template-based JavaScript and HTML5 game framework. Core abstractions are provided for structured game development e.g.: Level classes and Entity Classes. 

The main point behind gamestrut.js is to provide JavaScript/HTML5 game developers the core elements of a game so they can structure their code without having to build these at the beginning of every project. These include abstractions in the form of classes: Game, Level, and Entities. These can then be used to produce game content in only a few hours or even minutes. 

On top of that, a physics engine comes included; the one of choice is "boxweb2d". This allows for the developer to save time writing level and game entity classes, and then having to code all the physics and collision logic for their game from scratch. Instead, an entity object already comes with default attributes for physics that can be changed for the perfect feel. 

As for keybinding, the standard JavaScript api for browser keybinds are too jittery and limiting for a decent gaming experience. Instead, the use of a library "Mousetrap.js" is used for 'konami code' features and fluid key response.

I hope this can help as a suitable jump start on game projects. Although the core aspects have already been developed, there is still a lot of polish to be done for a suitable development release. 

Happy game developing! 

==============
## Getting Started

To get started, there are three main classes with which to familiarize oneself:

1. Game (REFERENCE to readme section)
2. Level (REFERENCE to readme section)
3. Entities (REFERENCE to readme section)

### Game (REFERENCE to api docs):

This class defines a 'Game' object -- it provides the basic code of a game. This is based on a loop with the stages of: a logic update; clearing of the canvas element; rendering of the game graphics on the canvas element. Moreover, it holds 'Level' objects, and many functions allowing the coding of game logic, and populating its 'Level' objects (REFERENCE to api doc).

~~~~ javascript
var game = new Game('my-canvas-element-id');

game.setCanvasWidth(800);
game.setCanvasHeight(600);
~~~~

### Level (REFERENCE to api docs):

This class defines a 'Level' object -- it is a datatype that holds entities to populate it:

* AnimateEntity (REFERENCE to readme section)
* TextEntity (REFERENCE to readme section)
* Background (REFERENCE to readme section)

~~~~ javascript
var level = game.newLevel({
	gravityH: 0, // optional
	gravityV: 58 // optional
});
~~~~

### Entities (REFERENCE to api docs):

Entities are objects that populate an instance of the 'Level' class. They come in different types:

* AnimateEntity (REFERENCE to readme section)
* TextEntity (REFERENCE to readme section)
* Background (REFERENCE to readme section)

Each entity class serves a purpose.

#### AnimateEntity (REFERENCE to api docs)

These are entites that are "loose" and interact with physical forces in the game, i.e. they get pulled by gravity -- if it is present -- and pushed around by collisions with other interactive entities.

~~~~ javascript 
var player = game.newAnimateEntity({
	id: 'Player',
	x: 100,
	y: 100,
	width: 40,
	height: 40,
	sx: 0,
	sy: 0,
	angle: 0, 
	world: level.world
});
~~~~
#### TextEntity (REFERENCE to api docs)

These are entities that represent text. They do not interact with any object, but serve for things like titles. 

~~~~ javascript
var title = game.newTextEntity('This is a title!', {
	id: 'title',
	x: 250,
	y: 50,
	fontFamily: 'Helvetica',
	fontColor: '#00ff00'
});
~~~~

#### Background (REFERENCE to api docs)

The 'Background' class creates an object that displays an image in the background of the level; it is the first entity to be rendered on the canvas, and does not interact with anything else.

If a 'Background' object renders an image, it will maintain its "zoom" and aspect ratio, even if it renders out of the canvas edges. It also stays at a fixed position relative to its parent's -- a 'Level' (REFERENCE to api docs) object -- x and y coordinates.

~~~~ javascript
var background = game.newBackground('images/background.png');

level.setBackground(background);
~~~~
